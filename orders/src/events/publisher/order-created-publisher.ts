import { Publisher, Subjects, OrderCreatedEvent } from "@kgplantings/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
