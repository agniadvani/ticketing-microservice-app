import request from 'supertest'
import { app } from "../../app"

const createTicket = () => {
    return request(app)
        .post("/api/tickets")
        .send({
            title: "Test Title",
            price: 2000
        })
        .set("Cookie", signup())
        .expect(201)
}

it("should return all the entries in the tickets collection", async () => {
    await createTicket()
    await createTicket()
    await createTicket()

    const response = await request(app)
        .get("/api/tickets")
        .send()
        .expect(200)

    expect(response.body.length).toEqual(3)
})