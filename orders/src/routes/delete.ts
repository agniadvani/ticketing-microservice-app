import express from 'express'
import { Order } from '../models/order'
import { NotAuthorizedError, NotFoundError, OrderStatus, requireAuth } from '@aggitix/common'

const router = express.Router()

router.delete("/api/orders/:orderId", requireAuth, async (req: express.Request, res: express.Response) => {
    const order = await Order.findById(req.params.orderId)
    if (!order) {
        throw new NotFoundError()
    }
    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError()
    }

    order.status = OrderStatus.Cancelled
    await order.save()

    // publish an event saying it was cancelled

    return res.status(200).send(order)
})

export { router as deleteOrderRouter }
