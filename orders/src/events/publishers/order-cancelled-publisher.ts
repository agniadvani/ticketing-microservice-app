import { OrderCancelledEvent, Publisher, Subjects } from "@aggitix/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}