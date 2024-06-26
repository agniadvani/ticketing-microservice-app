import express from 'express'
import { body } from 'express-validator'
import { User } from '../models/user'
import { validateRequest, BadRequestError } from '@aggitix/common'
import { Password } from '../services/password'
import jwt from "jsonwebtoken"

const router = express.Router()

router.post("/api/users/signin", [
    body('email')
        .isEmail()
        .withMessage("Email must be valid"),
    body("password")
        .trim()
        .notEmpty()
        .withMessage("password must not be empty")
], validateRequest, async (req: express.Request, res: express.Response) => {
    const { email, password } = req.body
    const existingUser = await User.findOne({ email: email })

    if (!existingUser || !Password.comparePasswords(existingUser.password, password)) {
        throw new BadRequestError("Invalid Credentials")
    }
    const userJwt = jwt.sign({
        id: existingUser.id,
        email: existingUser.email
    }, process.env.JWT_KEY!)
    req.session = {
        jwt: userJwt
    }
    res.send(existingUser)
})

export { router as signinRouter }