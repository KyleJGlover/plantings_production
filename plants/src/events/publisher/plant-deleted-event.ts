import { Publisher, Subjects, PlantDeletedEvent } from "@kgplantings/common";

export class PlantDeletedPublisher extends Publisher<PlantDeletedEvent> {
  readonly subject = Subjects.PlantDeleted;
}
