import request from "supertest"
import { app } from "../../app"
import { OrderDoc } from "../../models/order"
import { Ticket, TicketDoc } from "../../models/ticket"

const buildTicket = async (): Promise<TicketDoc> => {
    const ticket = Ticket.build({
        title: "test_ticket",
        price: 2000
    })
    await ticket.save()
    return ticket
}

const createOrder = async (ticketId: string, user: string[]): Promise<OrderDoc> => {
    const response = await request(app)
        .post("/api/orders")
        .set("Cookie", user)
        .send({ ticketId: ticketId })
        .expect(201)

    return response.body as OrderDoc
}

it("only fetches orders for a particular user", async () => {

    const user1 = global.signup("test1@test.com", "user1_id")
    const user2 = global.signup("test2@test.com", "user2_id")

    // Create one order for User #1
    const ticket1 = await buildTicket()
    const order1 = await createOrder(ticket1.id, user1)

    // Create two tickets for USER #2
    const ticket2 = await buildTicket()
    const order2 = await createOrder(ticket2.id, user2)

    const ticket3 = await buildTicket()
    const order3 = await createOrder(ticket3.id, user2)

    // Fetch orders as user #2 
    const { body: orders } = await request(app)
        .get("/api/orders")
        .set("Cookie", user2)
        .expect(200)


    // Expect orders only for user #2
    expect(orders.length).toEqual(2)
    expect(orders[0].ticket.id).toEqual(order2.ticket.id)
    expect(orders[1].ticket.id).toEqual(order3.ticket.id)
})