import { Listener, OrderCreatedEvent, OrderStatus, Subjects } from "@aggitix/common";
import { Message } from "node-nats-streaming";
import { QUEUE_GROUP_NAME } from "./queue-group-name";
import { Order } from "../../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = QUEUE_GROUP_NAME;
    async onMessage(data: OrderCreatedEvent["data"], msg: Message): Promise<void> {

        const order = Order.build({
            id: data.id,
            price: data.ticket.price,
            status: data.status as OrderStatus,
            userId: data.userId,
            version: data.version
        })

        await order.save()

        msg.ack()
    }

}