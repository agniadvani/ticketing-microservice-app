import request from 'supertest'
import { app } from "../../app";

it("returns 201 status code on successfull sign up", async () => {
    process.env.JWT_KEY = "JWT_KEY"
    return request(app)
        .post("/api/users/signup")
        .send({
            email: "test@test.com",
            password: "password@123"
        })
        .expect(201)
})

it("returns 400 status with invalid email and password", async () => {
    await request(app)
        .post("/api/users/signup")
        .send({
            email: "test.com",
            password: "password@123"
        })
        .expect(400)

    await request(app)
        .post("/api/users/signup")
        .send({
            email: "test@test.com",
            password: "23"
        })
        .expect(400)
})

it("returns 400 status with missing email and password", async () => {
    await request(app)
        .post("/api/users/signup")
        .send({
            password: "password@123"
        })
        .expect(400)

    await request(app)
        .post("/api/users/signup")
        .send({
            email: "test@test.com",
        })
        .expect(400)
})

it("returns 400 status if email already exists in DB", async () => {
    await request(app)
        .post("/api/users/signup")
        .send({
            email: "test@test.com",
            password: "password@123"
        })
        .expect(201)

    await request(app)
        .post("/api/users/signup")
        .send({
            email: "test@test.com",
            password: "password@123"
        })
        .expect(400)
})

it("require to send a cookie with JWT on a successfull signup", async () => {
    const response = await request(app)
        .post("/api/users/signup")
        .send({
            email: "test@test.com",
            password: "password@123"
        })
        .expect(201)

    expect(response.get("Set-Cookie")).toBeDefined()

})