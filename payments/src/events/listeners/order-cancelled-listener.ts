import {
  Listener,
  Subjects,
  OrderCancelledEvent,
  OrderStatus,
} from "@kgplantings/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    // Find the order that the order is reserving
    const order = await Order.findById({
      _id: data.id,
      version: data.version - 1,
    });

    // If no order, throw error
    if (!order) {
      throw new Error("Plant not found");
    }

    // Mark the order as being reserved by setting its order Status property
    order.set({
      status: OrderStatus.Cancelled,
    });

    // Save the plant
    await order.save();

    msg.ack();
  }
}
