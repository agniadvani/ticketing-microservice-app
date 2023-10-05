import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'

let mongo: MongoMemoryServer

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
})


// After all the tests have been run we have to stop the mongodb memory server 
// and we should successfully close the mongoose connection
afterAll(async () => {
    if (mongo) {
        await mongo.stop()
    }
    await mongoose.connection.close()
})

