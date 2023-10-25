import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear()

let stan = nats.connect("ticketing", "abc", {
    url: "http://localhost:4222"
})

stan.on('connect', async () => {

    console.log("Publisher Connected to NATS")

    stan.on('close', () => {
        console.log("Closing NATs Server")
        process.exit()
    })

    const publisher = new TicketCreatedPublisher(stan)

    try {
        await publisher.publish({
            id: '123',
            title: 'Concert',
            price: 2000
        })
    } catch (err) {
        console.log(err)
    }
})

process.on('SIGINT', () => { stan.close() })
process.on('SIGTERM', () => { stan.close() })