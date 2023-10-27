import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../app'
import { natsWrapper } from '../../nats-wrapper'

it("should return 401 if the user is not authenticated", async () => {
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app)
        .put(`/api/tickets/${id}`)
        .expect(401)
})

it("should return 400 if the title and price are invalid", async () => {
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: "",
            price: 2000
        })
        .set("Cookie", signup())
        .expect(400)

    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: "Test Title",
            price: -10
        })
        .set("Cookie", signup())
        .expect(400)
})

it("should return 404 if no entry is found in the collection with the provided id", async () => {
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: "Test Title",
            price: 2000
        })
        .set("Cookie", signup())
        .expect(404)
})

it("should return 401 if the userId of the ticket does not match the userId of the logged in user", async () => {
    const response = await request(app)
        .post("/api/tickets")
        .send({
            title: "Test Title",
            price: 2000
        })
        .set("Cookie", signup())
        .expect(201)

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .send({
            title: "Updated Title",
            price: 2500
        })
        .set("Cookie", signup("test1@test.com", "64f6d09711bf3a80ba9443eb"))
        .expect(401)
})

it("should return 200 if title and price are valid and the user is authenticated and has rights to update the ticket", async () => {
    const cookie = signup()
    const title = "Updated Title"
    const price = 2500
    const response = await request(app)
        .post("/api/tickets")
        .send({
            title: "Test Title",
            price: 2000
        })
        .set("Cookie", cookie)
        .expect(201)

    const updateResponse = await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .send({
            title: title,
            price: price
        })
        .set("Cookie", cookie)
        .expect(200)

    expect(response.body.id).toEqual(updateResponse.body.id)
    expect(updateResponse.body.title).toEqual(title)
    expect(updateResponse.body.price).toEqual(price)
})


it("should publish an event", async () => {
    const cookie = signup()
    const title = "Updated Title"
    const price = 2500
    const response = await request(app)
        .post("/api/tickets")
        .send({
            title: "Test Title",
            price: 2000
        })
        .set("Cookie", cookie)
        .expect(201)

    const updateResponse = await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .send({
            title: title,
            price: price
        })
        .set("Cookie", cookie)
        .expect(200)

    expect(natsWrapper.client.publish).toBeCalled()
})