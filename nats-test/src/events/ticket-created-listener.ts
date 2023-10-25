import nats from 'node-nats-streaming'
import { Listener } from '../../../common/src/events/base-listener'
import { Subjects } from '../../../common/src/events/subjects'
import { TicketCreatedEvent } from '../../../common/src/events/ticket-created-event'

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated
    queueGroupName = "payments-service"
    onMessage(data: TicketCreatedEvent['data'], msg: nats.Message): void {
        console.log("Data Recieved:", data)
        msg.ack()
    }
}