import 'bootstrap/dist/css/bootstrap.css'
import BuildClient from '../api/build-client'
import Header from '../components/header'

const App = ({ Component, pageProps, currentUser }) => {
    return <div>
        <Header currentUser={currentUser} />
        <Component {...pageProps} />
    </div>
}

App.getInitialProps = async appContext => {
    console.log("APP Component")
    const client = BuildClient(appContext.ctx)
    const { data } = await client.get("/api/users/currentuser").catch(err => console.log(err))

    // Config to run getInitial props for all the pages
    let pageProps = {}

    if (appContext.Component.getInitialProps) {
        pageProps = await appContext.Component.getInitialProps(appContext.ctx)
    }

    console.log("appcomp:", pageProps)
    return {
        pageProps,
        currentUser: data.currentUser
    }
}

export default App