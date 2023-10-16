import { randomBytes } from 'crypto'
import nats from 'node-nats-streaming'

console.clear()

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
    url: "http://localhost:4222"
})

stan.on('connect', () => {
    console.log("Listener Connected to NATS")

    stan.on('close', () => {
        console.log("Closing NATs Server")
        process.exit()
    })

    const options = stan.subscriptionOptions().setManualAckMode(true)

    const subscription = stan.subscribe("ticket:created", 'listen-service-queue-group', options)

    subscription.on('message', (msg: nats.Message) => {
        if (typeof msg.getData() === "string") {
            console.log(`Recieved event #${msg.getSequence()}, with data: ${msg.getData()}`)
        }
        msg.ack()
    })
})

process.on('SIGINT', () => { stan.close() })
process.on('SIGTERM', () => { stan.close() })