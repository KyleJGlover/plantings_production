import mongoose from "mongoose";
import express, { Request, Response } from "express";
import {
  NotFoundError,
  requireAuth,
  validateRequest,
  BadRequestError,
} from "@kgplantings/common";
import { body } from "express-validator";
import { Plant } from "../models/plant";
import { Order, OrderStatus } from "../models/order";
import { natsWrapper } from "../nats-wrapper";
import { OrderCreatedPublisher } from "../events/publisher/order-created-publisher";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 5 * 60;

// Small coupling with the plants model from service
router.post(
  "/api/orders",
  requireAuth,
  [
    body("plantId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("PlantId must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { plantId } = req.body;
    // Find the plant the user is trying to order in the database
    const plant = await Plant.findById(plantId);
    if (!plant) {
      throw new NotFoundError();
    }

    const isReserved = await plant.isReserved();
    if (isReserved) {
      throw new BadRequestError("Plant is already reserved");
    }
    //console.log(process.env.EXPIRATION_WINDOW_SECONDS);
    // Calc a expiration date for the order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // Build the order and save it to the database
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      plant,
    });

    await order.save();

    // publish an event saying that an order was created
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      plant: {
        id: plant.id,
        price: plant.price,
      },
    });

    res.status(201).send(order);
  }
);

export { router as createOrderRouter };
