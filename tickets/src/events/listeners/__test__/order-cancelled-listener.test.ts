import { OrderCancelledEvent, OrderCreatedEvent, OrderStatus } from "@aggitix/common"
import { natsWrapper } from "../../../nats-wrapper"
import mongoose from "mongoose"
import { Ticket } from "../../../models/ticket"
import { Message } from "node-nats-streaming"
import { OrderCancelledListener } from "../order-cancelled-listener"

const setup = async () => {
    // Create a Listener
    const listener = new OrderCancelledListener(natsWrapper.client)

    // Build a ticket
    const ticket = Ticket.build({
        title: "Test Ticket",
        price: 2000,
        userId: "test_user"
    })

    ticket.set({ orderId: new mongoose.Types.ObjectId().toHexString() })
    await ticket.save()

    // Define the data and msg for on message
    const data: OrderCancelledEvent["data"] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        ticket: {
            id: ticket.id,
        }
    }

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    // Call the onMessage function
    await listener.onMessage(data, msg)

    return { listener, ticket, data, msg }
}



it("acks the msg if there is a ticket for an order in the data recieved", async () => {
    const { ticket, data, msg } = await setup()
    const updatedTicket = await Ticket.findById(ticket.id)
    expect(updatedTicket!.orderId).toEqual(undefined)
    expect(msg.ack).toHaveBeenCalled()
})

it("publishes ticket updated event", async () => {
    await setup()
    expect(natsWrapper.client.publish).toHaveBeenCalled()
})