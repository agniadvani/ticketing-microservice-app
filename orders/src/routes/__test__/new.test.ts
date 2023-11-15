import mongoose from "mongoose"
import request from "supertest"
import { app } from "../../app"
import { natsWrapper } from "../../nats-wrapper"


it("returns a 404 error if the ticket is not found", async () => {
    const ticketId = new mongoose.Types.ObjectId()

    await request(app)
        .post("/api/orders")
        .set('Cookie', global.signup())
        .send({ ticketId })
        .expect(404)
})

it("returns 400 if the ticket is already reserved", async () => {
    const user = global.signup()
    const ticket = await global.buildTicket()

    const order = await global.createOrder(ticket.id, user)

    await request(app)
        .post("/api/orders")
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(400)
})

it("reserves a ticket", async () => {
    const ticket = await global.buildTicket()

    const response = await request(app)
        .post("/api/orders")
        .set("Cookie", global.signup())
        .send({ ticketId: ticket.id })
        .expect(201)

    const order = response.body
    expect(order.ticket.id == ticket.id)
    expect(order.ticket.title == ticket.title)
    expect(order.ticket.price == ticket.price)
})

it("emits an event on creation of an order", async () => {
    const ticket = await global.buildTicket()

    await request(app)
        .post("/api/orders")
        .set("Cookie", global.signup())
        .send({ ticketId: ticket.id })
        .expect(201)

    expect(natsWrapper.client.publish).toHaveBeenCalled()
})