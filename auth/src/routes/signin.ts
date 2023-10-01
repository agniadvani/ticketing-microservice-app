import express from 'express'
const router = express.Router()

router.post("/api/users/signin", (req, res) => {
    try {
        console.log("Hi There")
    } catch (err: any) {
        console.log(err.message)
    }
})

export { router as signinRouter }