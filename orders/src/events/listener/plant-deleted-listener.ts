import { Listener, Subjects, PlantDeletedEvent } from "@kgplantings/common";
import { Message } from "node-nats-streaming";
import { Plant } from "../../models/plant";
import { queueGroupName } from "./queue-group-name";

export class PlantDeletedListener extends Listener<PlantDeletedEvent> {
  readonly subject = Subjects.PlantDeleted;
  queueGroupName = queueGroupName;

  async onMessage(data: PlantDeletedEvent["data"], msg: Message) {
    const { id } = data;
    const plant = await Plant.findById(id);
    if (!plant) {
      throw new Error("Plant not found");
    }

    await Plant.findByIdAndDelete(plant.id);

    msg.ack();
  }
}
