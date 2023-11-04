import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../app'


it('returns 404 if order is not found', async () => {
    const orderId = new mongoose.Types.ObjectId()

    await request(app)
        .get(`/api/orders/${orderId}`)
        .set("Cookie", global.signup())
        .expect(404)
})

it('returns 403 if userId does not match the orders user id', async () => {
    const user1 = global.signup("test1@test.com", "user1_id")
    const user2 = global.signup("test2@test.com", "user2_id")

    const ticket = await global.buildTicket()
    const order = await global.createOrder(ticket.id, user1)

    await request(app)
        .get(`/api/orders/${order.id}`)
        .set("Cookie", user2)
        .expect(401)
})

it('fetches the ticket with 200 status if user is authorized', async () => {
    const user = global.signup()
    const ticket = await global.buildTicket()
    const order = await global.createOrder(ticket.id, user)
    const { body: fetchedOrder } = await request(app)
        .get(`/api/orders/${order.id}`)
        .set("Cookie", user)
        .expect(200)

    expect(fetchedOrder).not.toBeNull()
    expect(fetchedOrder.id).toEqual(order.id)
    expect(fetchedOrder.userId).toEqual(order.userId)
})
