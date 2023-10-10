import { useState } from "react"
import useRequest from "../../hooks/use-request"
import Router from "next/router"

const signup = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { doRequest, errors } = useRequest({
        url: "/api/users/signup",
        method: "post",
        body: { email, password },
        onSuccess: () => Router.push("/")
    })

    const onSubmit = async (event) => {
        event.preventDefault()
        await doRequest()
    }
    return (
        <form onSubmit={e => onSubmit(e)}>
            <h1>Sign Up</h1>
            {errors}
            <div className="form-group">
                <label>Email Address</label>
                <input className="form-control" type="text" onChange={e => setEmail(e.target.value)} />
                <label>Password</label>
                <input className="form-control" type="password" onChange={e => setPassword(e.target.value)} />
            </div>
            <button className="btn btn-primary">Sign Up</button>
        </form>
    )
}

export default signup