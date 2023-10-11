import { requireAuth, validateRequest } from '@aggitix/common'
import express from 'express'
import { body } from 'express-validator'

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

    res.status(201).send({})
})

export { router as newTicketRouter }
