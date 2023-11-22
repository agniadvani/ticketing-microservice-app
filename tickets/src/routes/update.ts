import { BadRequestError, NotAuthorizedError, NotFoundError, requireAuth, validateRequest } from '@aggitix/common'
import express from 'express'
import { body } from 'express-validator'
import { Ticket } from '../models/ticket'
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher'
import { natsWrapper } from '../nats-wrapper'
const router = express.Router()

router.put("/api/tickets/:id", requireAuth, [
    body("title")
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Title is invalid"),

    body("price")
        .notEmpty()
        .isFloat({ gt: 0 })
        .withMessage("Price is invalid")

], validateRequest, async (req: express.Request, res: express.Response) => {
    const { id } = req.params
    const { title, price } = req.body
    const currentUser = req.currentUser
    const ticket = await Ticket.findById(id)
    if (!ticket) {
        throw new NotFoundError()
    }
    if (ticket.orderId) {
        throw new BadRequestError('could not update the ticket')
    }
    if (currentUser!.id !== ticket!.userId) {
        throw new NotAuthorizedError()
    }
    ticket.set({ title, price })
    await ticket.save()
    await new TicketUpdatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        price: ticket.price,
        title: ticket.title,
        userId: ticket.userId,
        version: ticket.version
    })

    res.send(ticket)
})

export { router as updateTicketRouter }
