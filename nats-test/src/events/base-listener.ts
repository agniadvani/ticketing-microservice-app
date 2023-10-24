import nats from 'node-nats-streaming';
import { Subjects } from './subjects';

interface Event {
    subject: Subjects;
    data: any
}

export abstract class Listener<T extends Event> {
    abstract subject: T['subject'];
    abstract queueGroupName: string;
    abstract onMessage(data: T['data'], msg: nats.Message): void

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
