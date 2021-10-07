import express, { Request, Response } from "express";
import { requireAuth, OrderStatus } from "@kgplantings/common";
import { Order } from "../models/order";

const router = express.Router();

router.get("/api/orders", requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({
    userId: req.currentUser!.id,
  }).populate("plant");

  res.send(orders);
});

export { router as allOrderRouter };
