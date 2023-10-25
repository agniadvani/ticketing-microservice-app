import { Publisher, Subjects, TicketCreatedEvent } from "@aggitix/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    subject: Subjects.TicketCreated = Subjects.TicketCreated
}