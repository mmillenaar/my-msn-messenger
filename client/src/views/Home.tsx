import { useContext, useEffect } from "react"
import Context from "../Context/AppContext"


const Home = () => {
    const { userData, checkUserLogin, logout } = useContext(Context)!

    useEffect(() => {
        if (!userData) {
            checkUserLogin()
        }
    }, [userData, checkUserLogin])

    if (!userData) {
        return <div>Loading user data...</div>
    }

    return (
        <div className="home">
            <div className="home__wrapper">
                <h1 className="home__title">
                    Welcome {userData?.username}!
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