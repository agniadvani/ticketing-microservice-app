import express from 'express'
import { body, validationResult } from 'express-validator'
import { RequestValidationError } from '../errors/request-validation-error'
import { BadRequestError } from '../errors/bad-request-error'
import { User } from '../models/user'
import { validateRequest } from '../middlewares/validate-request'
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
    const user = await User.findOne({ email: email })
    if (!user) {
        throw new BadRequestError("User does not exist")
    }

    res.send("Signed in successfully")

})

export { router as signinRouter }