import { TicketCreatedEvent } from "@aggitix/common"
import { natsWrapper } from "../../../nats-wrapper"
import { TicketCreatedListener } from "../ticket-created-listener"
import mongoose from "mongoose"
import { Message } from "node-nats-streaming"
import { Ticket } from "../../../models/ticket"


const setup = async () => {
    // Create a listener with fake nats client
    const listener = new TicketCreatedListener(natsWrapper.client)

    // Create a fake data and msg objects
    const data: TicketCreatedEvent["data"] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        price: 3000,
        title: "Test Ticket",
        userId: "user_id",
        version: 0
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }
    await listener.onMessage(data, msg)

    return { data, msg }
}

it("creates and saves a ticket to the database", async () => {
    const { data } = await setup()
    const ticket = await Ticket.findById(data.id)
    expect(ticket).not.toBeNull()
    expect(ticket!.id).toEqual(data.id)
})

it("acks the msg object", async () => {
    const { msg } = await setup()
    expect(msg.ack).toHaveBeenCalled()
})