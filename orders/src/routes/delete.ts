import express from 'express'
import { Order } from '../models/order'
import { NotAuthorizedError, NotFoundError, OrderStatus } from '@aggitix/common'

const router = express.Router()

router.delete("/api/orders/:orderId", async (req: express.Request, res: express.Response) => {
    const order = await Order.findById(req.params.orderId)
    if(!order){
        throw new NotFoundError()
    }
    if(order.userId !== req.currentUser!.id){
        throw new NotAuthorizedError()
    }

    order.status = OrderStatus.Cancelled
    await order.save()
    return res.status(204).send(order)
})

export { router as deleteOrderRouter }
