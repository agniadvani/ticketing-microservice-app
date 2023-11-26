import { Listener, OrderCancelledEvent, Subjects } from "@aggitix/common";
import { Message } from "node-nats-streaming";
import { QUEUE_GROUP_NAME } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent>{
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = QUEUE_GROUP_NAME;

    async onMessage(data: OrderCancelledEvent["data"], msg: Message): Promise<void> {
        const client = this.client
        const ticket = await Ticket.findById(data.ticket.id)

        if (!ticket) {
            console.log("Ticket not found")
            return
        }

        ticket.set({ orderId: undefined })
        await ticket.save()

        await new TicketUpdatedPublisher(client).publish({
            id: ticket.id,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId,
            version: ticket.version,
            orderId: ticket.orderId
        })

        msg.ack()
    }

}