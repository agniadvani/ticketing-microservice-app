import express from 'express'

const router = express.Router()

router.post("/api/orders", async (req: express.Request, res: express.Response) => {
    res.send({})
})

export { router as newOrderRouter }
