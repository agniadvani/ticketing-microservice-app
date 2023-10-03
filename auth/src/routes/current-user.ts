import express from 'express'
import jwt from "jsonwebtoken"

const router = express.Router()

router.get("/api/users/currentuser", (req: express.Request, res: express.Response) => {
    try {
        if (!req.session?.jwt) {
            return res.send({ currentUser: null })
        }

        try {
            const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!)
            res.send({ currentUser: payload })
        } catch (err) {
            return res.send({ currentUser: null })
        }

    } catch (err: any) {
        console.log(err.message)
    }
})

export { router as currentUserRouter }