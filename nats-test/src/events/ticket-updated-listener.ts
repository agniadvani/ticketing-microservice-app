import { Listener, Subjects, TicketUpdatedEvent } from "@aggitix/common";
import { Message } from "node-nats-streaming";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent>{
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    queueGroupName = "payments-service";
    onMessage(data: TicketUpdatedEvent['data'], msg: Message): void {
        console.log("Data Recieved:", data)
        msg.ack()
    }
}