import { OrderStatus } from "@aggitix/common"
import mongoose from "mongoose"
import request from "supertest"
import { app } from "../../app"
import { Order } from "../../models/order"
import { Ticket } from "../../models/ticket"

it("returns a 404 error if the ticket is not found", async () => {
    const ticketId = new mongoose.Types.ObjectId()

    await request(app)
        .post("/api/orders")
        .set('Cookie', global.signup())
        .send({ ticketId })
        .expect(404)
})

it("returns 400 if the ticket is already reserved", async () => {
    const ticket = Ticket.build({
        title: "Concert",
        price: 2000
    })

    await ticket.save()

    const order = Order.build({
        userId: "912837913",
        status: OrderStatus.Created,
        expiresAt: new Date(),
        ticket: ticket
    })

    await order.save()

    await request(app)
        .post("/api/orders")
        .set('Cookie', global.signup())
        .send({ ticketId: ticket.id })
        .expect(400)
})

it("reserves a ticket", async () => {
    const ticket = Ticket.build({
        title: "Concert",
        price: 2000
    })

    await ticket.save()

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

it.todo("emits an event on creation of an order")