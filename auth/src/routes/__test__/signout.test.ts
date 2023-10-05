import request from 'supertest'
import { app } from "../../app"

it("cookie should not be present on response header after signout", async () => {

    const cookie = await global.signup()

    const response = await request(app)
        .post("/api/users/signout")
        .expect(200)

    expect(response.get("Set-Cookie")[0]).toEqual(
        'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
    )

})