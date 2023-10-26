import { Publisher, Subjects, TicketUpdatedEvent } from "@aggitix/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated
}