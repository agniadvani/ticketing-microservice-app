import request from 'supertest'
import { app } from "../../app"

it("returns 400 on invalid email or password", async () => {
    await request(app)
        .post("/api/users/signin")
        .send({
            email: "test.com",
            password: "password@123"
        })
        .expect(400)

    await request(app)
        .post("/api/users/signin")
        .send({
            email: "test@test.com",
            password: "12"
        })
        .expect(400)
})

it("returns 400 if email or password are incorrect", async () => {


    await request(app)
        .post("/api/users/signup")
        .send({
            email: "test@test.com",
            password: "password@123"
        })
        .expect(201)

    await request(app)
        .post("/api/users/signin")
        .send({
            email: "test@jest.com",
            password: "password@123"
        })
        .expect(400)

    await request(app)
        .post("/api/users/signin")
        .send({
            email: "test@test.com",
            password: "password@124"
        })
        .expect(400)
})

it("returns 200 on a successful signin", async () => {

    const cookie = await global.signup()
    await request(app)
        .post("/api/users/signin")
        .send({
            email: "test@test.com",
            password: "password@123"
        })
        .expect(200)
})