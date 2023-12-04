import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'
import { Order } from '../../models/order'
import { OrderStatus } from '@aggitix/common'
import { stripe } from '../../stripe'
import { Payment } from '../../models/payment'


jest.mock("../../stripe.ts")

it("should return 404 if the order does not exist", async () => {
    await request(app)
        .post("/api/payments")
        .set('Cookie', global.signup())
        .send({
            token: "TEST",
            orderId: new mongoose.Types.ObjectId()
        })
        .expect(404)
})

it("should return 401 when user is different from the userId in order", async () => {
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        price: 2000,
        status: OrderStatus.Created,
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 0
    })

    await order.save()

    await request(app)
        .post("/api/payments")
        .set('Cookie', global.signup())
        .send({
            token: "TEST",
            orderId: order.id
        })
        .expect(401)
})

it("should return 400 if order is cancelled", async () => {
    const userId = new mongoose.Types.ObjectId().toHexString()
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        price: 2000,
        status: OrderStatus.Cancelled,
        userId: userId,
        version: 0
    })

    await order.save()

    await request(app)
        .post("/api/payments")
        .set('Cookie', global.signup("test@test.com", userId))
        .send({
            token: "TEST",
            orderId: order.id
        })
        .expect(400)
})

it("should return 201 on successfull charge", async () => {
    const userId = new mongoose.Types.ObjectId().toHexString()
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        price: 2000,
        status: OrderStatus.Created,
        userId: userId,
        version: 0
    })

    await order.save()

    await request(app)
        .post("/api/payments")
        .set('Cookie', global.signup("test@test.com", userId))
        .send({
            token: "TEST",
            orderId: order.id
        })
        .expect(201)
    expect(stripe.paymentIntents.create).toHaveBeenCalled()
    const chargeOptions = (stripe.paymentIntents.create as jest.Mock).mock.calls[0][0]

    expect(chargeOptions.currency).toEqual("INR")
    expect(chargeOptions.amount).toEqual(order.price * 100)
    expect(chargeOptions.payment_method_types[0]).toEqual('card')
    expect(chargeOptions.description).toEqual(`Charge of Rs. ${order.price} for ticket purchased.`)

    const payment = await Payment.findOne({ orderId: order.id, stripeId: "TEST" })
    expect(payment).not.toBeNull()
})