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
        .notEmpty()
        .withMessage("price is mandatory")
], validateRequest, async (req: express.Request, res: express.Response) => {

    res.status(201).send({})
})

export { router as newTicketRouter }
