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

    new TicketCreatedListener(stan).listen()
})

process.on('SIGINT', () => { stan.close() })
process.on('SIGTERM', () => { stan.close() })

abstract class Listener {
    abstract subject: string;
    abstract queueGroupName: string;
    abstract onMessage(data: any, msg: nats.Message): void

    protected ackWait = 5 * 1000;
    private client: nats.Stan;

    constructor(client: nats.Stan) {
        this.client = client
    }

    subscriptionOptions() {
        return this.client.subscriptionOptions()
            .setManualAckMode(true)
            .setDeliverAllAvailable()
            .setDurableName(this.queueGroupName)
            .setAckWait(this.ackWait)
    }

    listen() {
        const subscription = this.client.subscribe(
            this.subject, this.queueGroupName, this.subscriptionOptions()
        )

        subscription.on('message', (msg) => {
            console.log(`Message Recieved: ${this.subject} / ${this.queueGroupName}`)
            const data = this.parseMessage(msg)
            this.onMessage(data, msg)
        })
    }

    parseMessage(msg: nats.Message): string {
        const data = msg.getData()
        return typeof data === "string" ?
            JSON.parse(data) : JSON.parse(data.toString('utf-8'))
    }
}


class TicketCreatedListener extends Listener {
    subject = "ticket:created"
    queueGroupName = "payments-service-queue-group"
    onMessage(data: any, msg: nats.Message): void {
        console.log("Data Recieved:", data)
        msg.ack()
    }
}