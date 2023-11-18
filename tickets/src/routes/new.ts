import { requireAuth, validateRequest } from '@aggitix/common'
import express from 'express'
import { body } from 'express-validator'
import { Ticket } from '../models/ticket'
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

router.post("/api/tickets", requireAuth, [
    body('title')
        .notEmpty()
        .isLength({ min: 3, max: 100 })
        .withMessage("title is mandatory"),

    body('price')
        .isFloat({ gt: 0 })
        .withMessage("price should be greater than 0")
], validateRequest, async (req: express.Request, res: express.Response) => {

    const { title, price } = req.body

    const ticket = Ticket.build({
        title: title,
        price: price,
        userId: req.currentUser!.id
    })

    await ticket.save()

    await new TicketCreatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId
    })

    res.status(201).send(ticket)
})

export { router as newTicketRouter }
