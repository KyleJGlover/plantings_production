import { Publisher, Subjects, PlantUpdatedEvent } from "@kgplantings/common";

export class PlantUpdatedPublisher extends Publisher<PlantUpdatedEvent> {
  readonly subject = Subjects.PlantUpdated;
}
