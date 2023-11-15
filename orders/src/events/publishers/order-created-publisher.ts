import { OrderCreatedEvent, Publisher, Subjects } from "@aggitix/common";


export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}