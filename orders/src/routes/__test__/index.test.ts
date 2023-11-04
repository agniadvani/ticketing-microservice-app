import request from "supertest"
import { app } from "../../app"



it("only fetches orders for a particular user", async () => {

    const user1 = global.signup("test1@test.com", "user1_id")
    const user2 = global.signup("test2@test.com", "user2_id")

    // Create one order for User #1
    const ticket1 = await global.buildTicket()
    const order1 = await global.createOrder(ticket1.id, user1)

    // Create two tickets for USER #2
    const ticket2 = await global.buildTicket()
    const order2 = await global.createOrder(ticket2.id, user2)

    const ticket3 = await global.buildTicket()
    const order3 = await global.createOrder(ticket3.id, user2)

    // Fetch orders as user #2 
    const { body: orders } = await request(app)
        .get("/api/orders")
        .set("Cookie", user2)
        .expect(200)


    // Expect orders only for user #2
    expect(orders.length).toEqual(2)
    expect(orders[0].id).toEqual(order2.id)
    expect(orders[1].id).toEqual(order3.id)
    expect(orders[0].ticket.id).toEqual(order2.ticket.id)
    expect(orders[1].ticket.id).toEqual(order3.ticket.id)
})