import BuildClient from "../api/build-client"


const Index = ({ currentUser }) => {
    console.log(currentUser)
    return currentUser ? <h1>You are signed in</h1> : <h1>You are not signed in</h1>
}

Index.getInitialProps = async (context) => {
    const client = BuildClient(context)
    const { data } = await client.get("/api/users/currentuser").catch(err => console.log(err))
    return data
}

export default Index