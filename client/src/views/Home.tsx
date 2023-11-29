import { useContext } from "react"
import Context from "../Context/AppContext"

interface HomeProps {
    username: string
}

const Home = ({ username }: HomeProps) => {

    const { logout } = useContext(Context)!

    return (
        <div className="home">
            <div className="home__wrapper">
                <h1 className="home__title">
                    Welcome {username}!
                </h1>
                <div className="home__logout-wrapper">
                    <div className="home__logout-button">
                        <p onClick={logout}>Logout</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home