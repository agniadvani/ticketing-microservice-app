import mongoose from "mongoose"
import { Order } from "../../../models/order"
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCreatedListener } from "../order-created-listener"
import { OrderCreatedEvent, OrderStatus } from "@aggitix/common"
import { Message } from "node-nats-streaming"

const setup = () => {
    const listener = new OrderCreatedListener(natsWrapper.client)

    const data: OrderCreatedEvent["data"] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        expiresAt: "test",
        status: OrderStatus.Created,
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        ticket: {
            id: new mongoose.Types.ObjectId().toHexString(),
            price: 2000
        }
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg }
}

it("should save the order", async () => {
    const { listener, data, msg } = setup()
    await listener.onMessage(data, msg)
    const order = await Order.findById(data.id)
    expect(order!.id).toEqual(data.id)
})

it("should ack the message", async () => {
    const { listener, data, msg } = setup()
    await listener.onMessage(data, msg)
    expect(msg.ack).toHaveBeenCalled()
})