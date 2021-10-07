import {
  Publisher,
  Subjects,
  ExpirationCompleteEvent,
} from "@kgplantings/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
