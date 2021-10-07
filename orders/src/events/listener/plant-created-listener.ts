import { Listener, Subjects, PlantCreatedEvent } from "@kgplantings/common";
import { Message } from "node-nats-streaming";
import { Plant } from "../../models/plant";
import { queueGroupName } from "./queue-group-name";

export class PlantCreatedListener extends Listener<PlantCreatedEvent> {
  readonly subject = Subjects.PlantCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PlantCreatedEvent["data"], msg: Message) {
    const { id, title, price } = data;
    const plant = Plant.build({
      id,
      title,
      price,
    });
    await plant.save();

    msg.ack();
  }
}
