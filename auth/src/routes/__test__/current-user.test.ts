import request from 'supertest'
import { app } from '../../app'

it("returns current user in the request object", async () => {
    const signupResponse = await request(app)
        .post("/api/users/signup")
        .send({
            email: "test@test.com",
            password: "password@123"
        })
        .expect(201)

    const cookie = signupResponse.get('Set-Cookie')

    const currentUserResponse = await request(app)
        .get("/api/users/currentuser")
        .set('Cookie', cookie)
        .expect(200)
})

it("should return an email and id properties in response body", async () => {
    const signupResponse = await request(app)
        .post("/api/users/signup")
        .send({
            email: "test@test.com",
            password: "password@123"
        })
        .expect(201)

    const cookie = signupResponse.get('Set-Cookie')

    const currentUserResponse = await request(app)
        .get("/api/users/currentuser")
        .set('Cookie', cookie)
        .expect(200)
    expect(currentUserResponse.body.currentUser.email).toBeDefined()
    expect(currentUserResponse.body.currentUser.id).toBeDefined()
})

it("current user's email and id should be equal to signed up user's email and id", async () => {
    const signupResponse = await request(app)
        .post("/api/users/signup")
        .send({
            email: "test@test.com",
            password: "password@123"
        })
        .expect(201)

    const cookie = signupResponse.get('Set-Cookie')

    const currentUserResponse = await request(app)
        .get("/api/users/currentuser")
        .set('Cookie', cookie)
        .expect(200)
    expect(currentUserResponse.body.currentUser.email).toEqual(signupResponse.body.email)
    expect(currentUserResponse.body.currentUser.id).toEqual(signupResponse.body.id)
})