import { useContext, useEffect } from "react"
import Context from "../context/AppContext"
import { setupUserEventsListener } from "../utils/websocket"
import msnLogo from '../assets/icons/MSN-messenger-icon.webp'
import ContactRequestsBar from "../components/ContactRequestsBar/ContactRequestsBar"
import ContactList from "../components/ContactList/ContactList"
import StatusHeader from "../components/StatusHeader/StatusHeader"
import HomeFooter from "../components/HomeFooter/HomeFooter"
import WindowTitleBar from "../components/WindowTitleBar/WindowTitleBar"
import '../styles/views/Home.scss'


const Home = () => {
    const {
        userData,
        isSocketConnected,
        checkUserLogin,
        setUserData,
        logout
    } = useContext(Context)

    useEffect(() => {
        if (isSocketConnected) {
            console.log('user events socket listening')
            setupUserEventsListener(setUserData)
        }
    }, [isSocketConnected, userData, setUserData])

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
            <div className="home__wrapper window">
                <div className="home__window-title-bar">
                    <WindowTitleBar
                        title="Windows Messenger"
                        icon={msnLogo}
                    />
                </div>
                <div className="home__content">
                    <div className="home__status-header">
                        <StatusHeader
                            username={userData.username}
                            status={userData.status}
                            id={userData.id}
                        />
                    </div>
                    <div className="home__contact-requests-bar">
                        <ContactRequestsBar
                            contactRequests={userData.contactRequests.received}
                        />
                    </div>
                    <div className="home__contact-list">
                        <ContactList contacts={userData.contacts}/>
                    </div>
                    <div className="home__footer">
                        <HomeFooter />
                    </div>
                    <div className="home__logout-wrapper">
                        <div className="home__logout-button">
                            {/* <p onClick={logout}>Logout</p> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home