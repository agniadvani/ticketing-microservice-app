import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../app'

it("should return not found in case the id is invalid", async () => {
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app)
        .get("/api/tickets/" + id)
        .expect(404)
})

it("should return the ticket if the ticket with id is found", async () => {
    const title = "Test Title"
    const price = 2000

    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", signup())
        .send({ title, price })
        .expect(201)

    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .expect(200)

    expect(ticketResponse.body.title).toEqual(title)
    expect(ticketResponse.body.price).toEqual(price)
    expect(ticketResponse.body.id).toEqual(response.body.id)
})