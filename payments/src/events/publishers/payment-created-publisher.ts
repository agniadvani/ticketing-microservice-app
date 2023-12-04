import { PaymentCreatedEvent, Publisher, Subjects } from "@aggitix/common";


export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}