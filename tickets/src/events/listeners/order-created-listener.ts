import { Listener, OrderCreatedEvent, Subjects } from "@aggitix/common";
import { Message } from "node-nats-streaming";
import { QUEUE_GROUP_NAME } from "./queue-group-name";
import { Ticket } from "../../models/ticket";


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

        // Ack the msg
        msg.ack()
    }

}