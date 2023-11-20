import { Listener, Subjects, TicketUpdatedEvent } from "@aggitix/common";
import { QUEUE_GROUP_NAME } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent>{
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    queueGroupName = QUEUE_GROUP_NAME;
    async onMessage(data: TicketUpdatedEvent["data"], msg: Message): Promise<void> {
        const { title, price } = data

        const ticket = await Ticket.findByEvent(data)

        if (!ticket) {
            console.log("Ticket not found so not acknowledging event")
            return
        }

        ticket.set({ title, price })

        await ticket.save()
        msg.ack()
    }
}