import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus, requireAuth, validateRequest } from "@aggitix/common"
import express from "express"
import { body } from "express-validator"
import { Order } from "../models/order"
import { stripe } from "../stripe"

const router = express.Router()

router.post("/api/payments", requireAuth, [
    body("token")
        .not()
        .isEmpty()
        .withMessage("token required to create charge"),

    body("orderId")
        .not()
        .isEmpty()
        .withMessage("orderId is required to create charge")
], validateRequest, async (req: express.Request, res: express.Response) => {

    const { token, orderId } = req.body
    const order = await Order.findById(orderId)
    if (!order) {
        throw new NotFoundError()
    }
    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError()
    }
    if (order.status === OrderStatus.Cancelled) {
        throw new BadRequestError("Order has been cancelled")
    }

    try {
        await stripe.paymentIntents.create({
            currency: "INR",
            amount: order.price * 100,
            payment_method_types: ['card'],
            description: `Charge of Rs. ${order.price} for ticket purchased.`
        })
    } catch (err) {
        throw new Error("Payment Unsuccessful")
    }

    res.status(201).send({ success: true })
})

export { router as createChargeRouter }