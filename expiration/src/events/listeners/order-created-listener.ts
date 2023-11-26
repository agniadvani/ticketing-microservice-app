import { Listener, OrderCreatedEvent, Subjects } from "@aggitix/common";
import { Message } from "node-nats-streaming";
import { QUEUE_GROUP_NAME } from "./queue-group-name";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = QUEUE_GROUP_NAME;
    async onMessage(data: OrderCreatedEvent["data"], msg: Message): Promise<void> {
        await expirationQueue.add({
            orderId: data.id
        })

        msg.ack()
    }
}