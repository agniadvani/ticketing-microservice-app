import express from 'express'

const router = express.Router()

router.delete("/api/orders/:orderId", async (req: express.Request, res: express.Response) => {
    res.send({})
})

export { router as deleteOrderRouter }
