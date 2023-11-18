import { NotFoundError } from '@aggitix/common'
import express from 'express'
import { isValidObjectId } from 'mongoose'
import { Ticket } from '../models/ticket'

const router = express.Router()

router.get("/api/tickets/:id", async (req: express.Request, res: express.Response) => {
    const { id } = req.params
    if (!isValidObjectId(id)) {
        throw new NotFoundError()
    }
    const ticketData = await Ticket.findById(id)
    if (!ticketData) {
        throw new NotFoundError()
    }
    return res.send(ticketData)
})

export { router as showTicketRouter }
