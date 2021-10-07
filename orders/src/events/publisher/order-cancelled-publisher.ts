import { Publisher, Subjects, OrderCancelledEvent } from "@kgplantings/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
