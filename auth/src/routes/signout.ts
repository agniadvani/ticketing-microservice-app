import express from 'express'
const router = express.Router()

router.post("/api/users/signout", (req, res) => {
    try {
        req.session = null
        res.send({})
    } catch (err: any) {
        console.log(err.message)
    }
})

export { router as signoutRouter }