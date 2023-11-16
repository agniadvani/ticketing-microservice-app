import { Listener, Subjects, TicketUpdatedEvent } from "@aggitix/common";
import { QUEUE_GROUP_NAME } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent>{
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    queueGroupName = QUEUE_GROUP_NAME;
    async onMessage(data: TicketUpdatedEvent["data"], msg: Message): Promise<void> {
        const { id, title, price } = data
        const ticket = await Ticket.findById(id)
        if (!ticket) {
            throw new Error('ticket not found')
        }
        ticket.set({ title, price })

        await ticket.save()

        msg.ack()
    }
}