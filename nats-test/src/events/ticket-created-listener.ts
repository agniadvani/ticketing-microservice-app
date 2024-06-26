import { Listener, Subjects, TicketCreatedEvent } from '@aggitix/common'
import nats from 'node-nats-streaming'

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated
    queueGroupName = "payments-service"
    onMessage(data: TicketCreatedEvent['data'], msg: nats.Message): void {
        console.log("Data Recieved:", data)
        msg.ack()
    }
}