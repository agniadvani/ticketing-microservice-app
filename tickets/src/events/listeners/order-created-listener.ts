import { Listener, OrderCreatedEvent, Subjects } from "@aggitix/common";
import { Message } from "node-nats-streaming";
import { QUEUE_GROUP_NAME } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";


export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = QUEUE_GROUP_NAME;
    async onMessage(data: OrderCreatedEvent["data"], msg: Message): Promise<void> {

        // Get the ticket for the order
        const ticket = await Ticket.findById(data.ticket.id)

        // if no ticket return
        if (!ticket) {
            console.log("No ticket found")
            return
        }

        // set the orderId property for that ticket and save it
        ticket.set({ orderId: data.id })
        await ticket.save()

        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId,
            version: ticket.version,
            orderId: ticket.orderId
        })

        // Ack the msg
        msg.ack()
    }

}