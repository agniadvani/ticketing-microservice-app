import { currentUser, errorHandler, NotFoundError } from '@aggitix/common'
import cookieSession from "cookie-session"
import express from "express"
import "express-async-errors"
import { indexTicketRouter } from './routes'
import { newTicketRouter } from "./routes/new"
import { showTicketRouter } from './routes/show'
import { updateTicketRouter } from './routes/update'

const app = express()
app.set('trust proxy', true)
app.use(express.json())
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test"
}))

app.use(currentUser)

app.use(newTicketRouter)
app.use(showTicketRouter)
app.use(indexTicketRouter)
app.use(updateTicketRouter)

app.all("*", async (req, res) => {
    throw new NotFoundError()
})

app.use(errorHandler)

export { app }
