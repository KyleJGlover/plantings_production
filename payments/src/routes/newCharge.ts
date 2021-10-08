import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Order } from "../models/order";
import {
  validateRequest,
  BadRequestError,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus,
  requireAuth,
} from "@kgplantings/common";

import { stripe } from "../stripe";
import { Payment } from "../models/payments";

import { PaymentCreatedPublisher } from "../events/publishers/payment-created-event";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [
    body("token").not().isEmpty().withMessage("Must provide a token"),
    body("orderId").not().isEmpty().withMessage("Must provide a order ID"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    console.log(order.status);
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("Cannot pay for an cancelled order.");
    }

    const priceInCents = order.price * 100;

    const charge = await stripe.charges.create({
      currency: "usd",
      amount: priceInCents,
      source: token,
    });

    const payment = Payment.build({
      orderId,
      stripeId: charge.id,
    });
    await payment.save();

    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    res.status(201).send({ id: payment.id });
  }
);

export { router as createChargeRouter };
