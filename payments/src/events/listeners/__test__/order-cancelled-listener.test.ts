import { OrderCancelledEvent, OrderStatus } from "@aggitix/common"
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCancelledListener } from "../order-cancelled-listener"
import mongoose from "mongoose"
import { Message } from "node-nats-streaming"
import { Order } from "../../../models/order"

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client)

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        price: 2000,
        status: OrderStatus.Created,
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 0
    })

    await order.save()

    const data: OrderCancelledEvent["data"] = {
        id: order.id,
        version: order.version + 1,
        ticket: {
            id: new mongoose.Types.ObjectId().toHexString()
        }
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    await listener.onMessage(data, msg)

    return { listener, data, msg }
}

it("should update order status to cancelled", async () => {
    const { listener, data, msg } = await setup()
    const order = await Order.findById(data.id)
    expect(order!.status).toEqual(OrderStatus.Cancelled)
    expect(order!.version).toEqual(data.version)
})

it("should ack the message", async () => {
    const { listener, data, msg } = await setup()
    expect(msg.ack).toHaveBeenCalled()
})