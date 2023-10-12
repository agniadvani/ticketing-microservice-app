import { NotAuthorizedError, NotFoundError, currentUser, requireAuth, validateRequest } from '@aggitix/common'
import express from 'express'
import { body } from 'express-validator'
import { Ticket } from '../../models/ticket'
const router = express.Router()

router.put("/api/tickets/:id", currentUser, requireAuth, [
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
    if (currentUser!.id !== ticket!.userId) {
        throw new NotAuthorizedError()
    }
    const updatedTicket = await Ticket.findByIdAndUpdate(id, {
        title: title,
        price: price
    }, { new: true })

    res.send(updatedTicket)
})

export { router as updateTicketRouter }
