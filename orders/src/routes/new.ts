import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@aggitix/common'
import express from 'express'
import { body } from 'express-validator'
import mongoose from 'mongoose'
import { Order } from '../models/order'
import { Ticket } from '../models/ticket'
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()
const EXPIRATION_WINDOW_SECONDS = 15 * 60

router.post("/api/orders", requireAuth, [
    body('ticketId')
        .not()
        .isEmpty()
        .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
        .withMessage('ticketId is not valid')
], validateRequest,
    async (req: express.Request, res: express.Response) => {

        const { ticketId } = req.body

        // Check if the ticket exists in the database
        const ticket = await Ticket.findById(ticketId)

        if (!ticket) {
            throw new NotFoundError()
        }
        // Check if the ticket is not reserved
        const isReserved = await ticket.isReserved()

        if (isReserved) {
            throw new BadRequestError("Ticket is already reserved")
        }

        // Create an expiration time of 15 minutes

        const expiration = new Date()
        expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)

        // Create a new order and associate the ticket to that order
        const order = Order.build({
            userId: req.currentUser!.id,
            status: OrderStatus.Created,
            expiresAt: expiration,
            ticket: ticket
        })

        await order.save()

        // Publish an order created event

        await new OrderCreatedPublisher(natsWrapper.client).publish({
            id: order.id,
            status: order.status,
            userId: order.userId,
            expiresAt: order.expiresAt.toISOString(),
            version: order.version,
            ticket: {
                id: ticket.id,
                price: ticket.price
            }
        })
        res.status(201).send(order)
    })

export { router as newOrderRouter }
