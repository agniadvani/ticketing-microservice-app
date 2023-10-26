import { Publisher, Subjects, TicketCreatedEvent } from "@aggitix/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
}