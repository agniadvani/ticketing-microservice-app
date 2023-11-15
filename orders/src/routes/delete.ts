import express from 'express'
import { Order } from '../models/order'
import { NotAuthorizedError, NotFoundError, OrderStatus, requireAuth } from '@aggitix/common'
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

router.delete("/api/orders/:orderId", requireAuth, async (req: express.Request, res: express.Response) => {
    const order = await Order.findById(req.params.orderId).populate('ticket')
    if (!order) {
        throw new NotFoundError()
    }
    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError()
    }

    order.status = OrderStatus.Cancelled
    await order.save()

    // publish an order cancelled event
    new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        ticket: {
            id: order.ticket.id
        }
    })

    return res.status(200).send(order)
})

export { router as deleteOrderRouter }
