import jwt from 'jsonwebtoken';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from "supertest";
import { app } from '../app';
import { OrderDoc } from '../models/order';
import { Ticket, TicketDoc } from '../models/ticket';

// Intercept file imports to a fake file using jest mock feature
jest.mock('../nats-wrapper.ts')

let mongo: MongoMemoryServer

// Declare a global function in test environment for signing up a user and recieving a cookie

declare global {
    var signup: (emailId?: string, userId?: string) => string[];
    var buildTicket: () => Promise<TicketDoc>;
    var createOrder: (ticketId: string, user: string[]) => Promise<OrderDoc>
}


// At the start of the test program create mongodb memory server and connect to it using mongoose
beforeAll(async () => {
    mongo = await MongoMemoryServer.create()
    const mongoUri = mongo.getUri()
    await mongoose.connect(mongoUri, {})
})

// Before Each test we have to get all connections available in the db and delete all the entries in those collections
beforeEach(async () => {
    const collections = await mongoose.connection.db.collections()
    for (const collection of collections) {
        await collection.deleteMany({})
    }

    jest.clearAllMocks()

    process.env.JWT_KEY = "JWT_KEY"
})


// After all the tests have been run we have to stop the mongodb memory server 
// and we should successfully close the mongoose connection
afterAll(async () => {
    if (mongo) {
        await mongo.stop()
    }
    await mongoose.connection.close()
})

global.signup = (emailId?: string, userId?: string) => {
    const email = emailId || "test@test.com"
    const id = userId || "64f6d09711bf3a80ba9443ea"
    const token = jwt.sign({
        id: id,
        email: email
    }, process.env.JWT_KEY!)
    const sessionObj = JSON.stringify({ jwt: token })
    const base64SessionObj = Buffer.from(sessionObj).toString("base64")
    return [`session=${base64SessionObj}`]
}

global.buildTicket = async (): Promise<TicketDoc> => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "test_ticket",
        price: 2000
    })
    await ticket.save()
    return ticket
}

global.createOrder = async (ticketId: string, user: string[]): Promise<OrderDoc> => {
    const response = await request(app)
        .post("/api/orders")
        .set("Cookie", user)
        .send({ ticketId: ticketId })
        .expect(201)

    return response.body as OrderDoc
}
