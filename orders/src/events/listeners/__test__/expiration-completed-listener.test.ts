import { ExpirationCompleteEvent, OrderStatus } from "@aggitix/common"
import { natsWrapper } from "../../../nats-wrapper"
import { ExpirationCompleteListener } from "../expiration-complete-listener"
import { Order } from "../../../models/order"
import mongoose from "mongoose"
import { Ticket } from "../../../models/ticket"
import { Message } from "node-nats-streaming"


const setup = async () => {
    const listener = new ExpirationCompleteListener(natsWrapper.client)
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        price: 2000,
        title: "Test Title"
    })
    await ticket.save()

    const order = Order.build({
        userId: new mongoose.Types.ObjectId().toHexString(),
        expiresAt: new Date(),
        status: OrderStatus.Created,
        ticket: ticket
    })
    await order.save()

    const data: ExpirationCompleteEvent["data"] = {
        orderId: order.id
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg }
}

it("should update order status to cancelled", async () => {
    const { listener, data, msg } = await setup()
    await listener.onMessage(data, msg)
    const order = await Order.findById(data.orderId)
    expect(order!.status).toEqual(OrderStatus.Cancelled)
})

it("should publish an event", async () => {
    const { listener, data, msg } = await setup()
    await listener.onMessage(data, msg)
    expect(natsWrapper.client.publish).toHaveBeenCalled()
})

it("should ack the message", async () => {
    const { listener, data, msg } = await setup()
    await listener.onMessage(data, msg)
    expect(msg.ack).toHaveBeenCalled()
})