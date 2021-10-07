import { Listener, Subjects, OrderCancelledEvent } from "@kgplantings/common";
import { Message } from "node-nats-streaming";
import { Plant } from "../../models/plant";
import { queueGroupName } from "./queue-group-name";
import { PlantUpdatedPublisher } from "../publisher/plant-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    // Find the plant that the order is reserving
    const plant = await Plant.findById(data.plant.id);

    // If no plant, throw error
    if (!plant) {
      throw new Error("Plant not found");
    }

    // Mark the plant as being reserved by setting its orderId property
    plant.set({
      orderId: undefined,
    });

    // Save the plant
    await plant.save();

    await new PlantUpdatedPublisher(this.client).publish({
      id: plant.id,
      title: plant.title,
      description: plant.description,
      price: plant.price,
      userId: plant.userId,
      imageFilename: plant.imageFilename,
      version: plant.version,
      orderId: plant.orderId,
    });

    msg.ack();
  }
}
