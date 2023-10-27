import Request from 'supertest'
import { Ticket } from '../../../models/ticket'
import { app } from '../../app'
import { natsWrapper } from '../../nats-wrapper'

it("has a route handler listening to /api/tickets for post requests", async () => {
    const response = await Request(app)
        .post("/api/tickets")
        .send({})

    expect(response.statusCode).not.toEqual(404)
})

it("returns an error if a user is not signed in", async () => {
    await Request(app)
        .post("/api/tickets")
        .send({})
        .expect(401)
})

it("can only be accessed if a user is signed in", async () => {
    const cookie = signup()
    const response = await Request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({})

    expect(response.statusCode).not.toEqual(401)
})

it("returns an error if an invalid title is provided", async () => {
    await Request(app)
        .post("/api/tickets")
        .set("Cookie", signup())
        .send({ title: "", price: "2000" })
        .expect(400)

    await Request(app)
        .post("/api/tickets")
        .set("Cookie", signup())
        .send({ price: 2000 })
        .expect(400)
})

it("returns an error if an invalid price is provided", async () => {
    await Request(app)
        .post("/api/tickets")
        .set("Cookie", signup())
        .send({ title: "Test Title" })
        .expect(400)

    await Request(app)
        .post("/api/tickets")
        .set("Cookie", signup())
        .send({ title: "Test Title", price: -2000 })
        .expect(400)
})

it("creates a ticket with valid inputs", async () => {
    let tickets = await Ticket.find({})
    expect(tickets.length).toEqual(0)

    const title = "Test Title"
    await Request(app)
        .post("/api/tickets")
        .set("Cookie", signup())
        .send({ title, price: 2000 })
        .expect(201)

    tickets = await Ticket.find({})
    expect(tickets.length).toEqual(1)
    expect(tickets[0].price).toEqual(2000)
    expect(tickets[0].title).toEqual(title)
})

it("publishes an event", async () => {
    const title = "Test Title"
    await Request(app)
        .post("/api/tickets")
        .set("Cookie", signup())
        .send({ title, price: 2000 })
        .expect(201)

    expect(natsWrapper.client.publish).toBeCalled()
})