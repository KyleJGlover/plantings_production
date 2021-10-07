import { Publisher, Subjects, PlantCreatedEvent } from "@kgplantings/common";

export class PlantCreatedPublisher extends Publisher<PlantCreatedEvent> {
  readonly subject = Subjects.PlantCreated;
}
