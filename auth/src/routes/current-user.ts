import express from 'express'
const router = express.Router()

router.get("/api/users/currentuser", (req, res) => {
    try {
        console.log("Hi There")
    } catch (err: any) {
        console.log(err.message)
    }
})

export { router as currentUserRouter }