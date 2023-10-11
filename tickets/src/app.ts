import { currentUser, errorHandler, NotFoundError } from '@aggitix/common'
import cookieSession from "cookie-session"
import express from "express"
import "express-async-errors"
import { newTicketRouter } from "./routes/new"

const app = express()
app.set('trust proxy', true)
app.use(express.json())
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test"
}))

app.use(currentUser)

app.use(newTicketRouter)

app.all("*", async (req, res) => {
    throw new NotFoundError()
})

app.use(errorHandler)

export { app }
