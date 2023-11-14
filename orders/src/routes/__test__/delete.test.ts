import request from "supertest"
import { app } from "../../app"
import mongoose from "mongoose"
import { OrderStatus } from "@aggitix/common"

it("returns 401 if user is not logged in", () => {
    const orderId = new mongoose.Types.ObjectId()
    return request(app)
        .delete("/api/orders/" + orderId)
        .expect(401)
})

it("returns a 404 if order is not found", () => {
    const user = global.signup()
    const orderId = new mongoose.Types.ObjectId()
    return request(app)
        .delete("/api/orders/" + orderId)
        .set("Cookie", user)
        .expect(404)
})

it("returns 401 if userId of order does not match the userId of the currentUser", async () => {
    const user1 = global.signup("test@test.com", "test_user")
    const user2 = global.signup()

    const ticket = await global.buildTicket()
    const order = await global.createOrder(ticket.id, user2)

    return request(app)
        .delete("/api/orders/" + order.id)
        .set("Cookie", user1)
        .expect(401)
})

it("returns 204 with successful response", async () => {
    const user = global.signup()
    const ticket = await global.buildTicket()
    const order = await global.createOrder(ticket.id, user)

    const { body: deletedOrder } = await request(app)
        .delete("/api/orders/" + order.id)
        .set("Cookie", user)
        .expect(200)


    expect(deletedOrder.id).toEqual(order.id)
    expect(deletedOrder.status).toEqual(OrderStatus.Cancelled)
})

it.todo("emits a order cancelled event")