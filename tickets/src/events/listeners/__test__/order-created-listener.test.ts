import { OrderCreatedEvent, OrderStatus } from "@aggitix/common"
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCreatedListener } from "../order-created-listener"
import mongoose from "mongoose"
import { Ticket } from "../../../models/ticket"
import { Message } from "node-nats-streaming"

const setup = async () => {
    // Create a Listener
    const listener = new OrderCreatedListener(natsWrapper.client)

    // Build a ticket
    const ticket = Ticket.build({
        title: "Test Ticket",
        price: 2000,
        userId: "test_user"
    })

    await ticket.save()

    // Define the data and msg for on message
    const data: OrderCreatedEvent["data"] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        userId: "test_user",
        version: 0,
        expiresAt: "",
        ticket: {
            id: ticket.id,
            price: 2000
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
    expect(updatedTicket!.orderId).toEqual(data.id)
    expect(msg.ack).toHaveBeenCalled()
})