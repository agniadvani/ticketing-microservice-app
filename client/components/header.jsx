import Link from "next/link"
const Header = ({ currentUser }) => {
    return (
        <nav className="navbar navbar-light bg-light">
            <Link className="navbar-brand" href="/" style={{ marginLeft: 10 }}>
                GitTix
            </Link>
            <div className="ml-auto d-flex">
                {currentUser ?
                    <Link className="btn btn-outline-success my-2 my-sm-0" style={{ marginRight: 10 }} href="/auth/signout">
                        Sign Out
                    </Link>
                    :
                    <>
                        <Link className="btn btn-outline-success my-2 my-sm-0" style={{ marginRight: 10 }} href="/auth/signin">
                            Sign In
                        </Link>
                        <Link className="btn btn-outline-success my-2 my-sm-0" style={{ marginRight: 10 }} href="/auth/signup">
                            Sign Up
                        </Link>
                    </>
                }
            </div>
        </nav>

    )
}

export default Header