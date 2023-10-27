import { Publisher, Subjects, TicketUpdatedEvent } from "@aggitix/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated
}