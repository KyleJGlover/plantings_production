import { Listener, Subjects, PlantUpdatedEvent } from "@kgplantings/common";
import { Message } from "node-nats-streaming";
import { Plant } from "../../models/plant";
import { queueGroupName } from "./queue-group-name";

export class PlantUpdatedListener extends Listener<PlantUpdatedEvent> {
  readonly subject = Subjects.PlantUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: PlantUpdatedEvent["data"], msg: Message) {
    const plant = await Plant.findByEvent(data);
    if (!plant) {
      throw new Error("Plant not found");
    }
    const { title, price } = data;
    plant.set({
      title,
      price,
    });
    await plant.save();

    msg.ack();
  }
}
