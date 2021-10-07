import { Subjects, Publisher, PaymentCreatedEvent } from "@kgplantings/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
