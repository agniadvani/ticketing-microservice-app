import { NotAuthorizedError, NotFoundError, requireAuth } from '@aggitix/common'
import express from 'express'
import { Order } from '../models/order'

const router = express.Router()

router.get("/api/orders/:orderId", requireAuth, async (req: express.Request, res: express.Response) => {
    const order = await Order.findById(req.params.orderId)

    if (!order) {
        throw new NotFoundError()
    }

    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError()
    }

    res.send(order)
})

export { router as showOrderRouter }
