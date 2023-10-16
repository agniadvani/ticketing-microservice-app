import nats from 'node-nats-streaming';

console.clear()

let stan = nats.connect("ticketing", "abc", {
    url: "http://localhost:4222"
})

stan.on('connect', () => {

    console.log("Publisher Connected to NATS")

    stan.on('close', () => {
        console.log("Closing NATs Server")
        process.exit()
    })


    const data = JSON.stringify({
        id: '123',
        title: 'Concert',
        price: 2000
    })

    stan.publish('ticket:created', data, () => {
        console.log("Event Published")
    })
})

process.on('SIGINT', () => { stan.close() })
process.on('SIGTERM', () => { stan.close() })