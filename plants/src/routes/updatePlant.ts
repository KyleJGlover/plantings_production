import express, { Request, Response } from "express";

import { Plant } from "../models/plant";
import { body } from "express-validator";
// Nats imports
import { natsWrapper } from "../nats-wrapper";
import { PlantUpdatedPublisher } from "../events/publisher/plant-updated-publisher";
// Error imports
import {
  NotFoundError,
  validateRequest,
  requireAuth,
  NotAuthorizedError,
  BadRequestError,
} from "@kgplantings/common";

const router = express.Router();

router.put(
  "/api/plants/:id",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("description").not().isEmpty().withMessage("Description is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage(" Price must be porovided and must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const plant = await Plant.findById(req.params.id);

    if (!plant) {
      throw new NotFoundError();
    }

    if (plant.orderId) {
      throw new BadRequestError("Can't edit an reserved ticket");
    }

    if (plant.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    plant.set({
      title: req.body.title,
      description: req.body.description,
      price: Number(req.body.price).valueOf(),
    });
    await plant.save();

    new PlantUpdatedPublisher(natsWrapper.client).publish({
      id: plant.id,
      title: plant.title,
      version: plant.version,
      description: plant.description,
      price: plant.price,
      userId: plant.userId,
      imageFilename: plant.imageFilename,
    });

    res.send(plant);
  }
);

export { router as updatePlantRouter };
