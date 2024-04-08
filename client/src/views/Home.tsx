import { useContext, useEffect } from "react"
import Context from "../context/AppContext"
import { setupUserEventsListener } from "../utils/websocket"
import ContactRequestsBar from "../components/ContactRequestsBar/ContactRequestsBar"
import { ContactRequestModalActionType, UserType } from "../utils/types"
import { ContactRequestActions } from "../utils/constants"
import ContactList from "../components/ContactList/ContactList"
import msnLogo from '../assets/icons/MSN-messenger-icon.webp'
import StatusHeader from "../components/StatusHeader/StatusHeader"
import '../styles/views/Home.scss'
import HomeFooter from "../components/HomeFooter/HomeFooter"


const Home = () => {
    const userData: UserType = {
        id: '123',
        username: 'matias',
        email: 'mat1@a.com',
        status: 'Busy',
        chats: [],
        contacts: [
            {
                username: 'mat',
                email: 'mat2@a.com',
                id: '321',
                status: 'Away',
            },
            {
                username: 'mat3',
                email: 'mat3@a.com',
                id: '3211',
                status: 'Away',
            },
            {
                username: 'mat5',
                email: 'mat5@a.com',
                id: '5211',
                status: 'Offline',
            },
            {
                username: 'mat4',
                email: 'mat4@a.com',
                id: '4211',
                status: 'Online',
            },
        ],
        contactRequests: {
            sent: [],
            received: [],
        }
    }
    // username: string;
    // email: string;
    // id: string;
    // status: string;
    // chatId?: string;

    // const { userData, isSocketConnected, checkUserLogin, setUserData, logout } = useContext(Context)

    // useEffect(() => {
    //     if (isSocketConnected) {
    //         console.log('user events socket listening')
    //         setupUserEventsListener(setUserData)
    //     }
    // }, [isSocketConnected, userData, setUserData])

    // useEffect(() => {
    //     if (!userData) {
    //         checkUserLogin()
    //     }
    // }, [userData, checkUserLogin])

    // if (!userData) {
    //     return <div>Loading user data...</div>
    // }

    const sendContactRequest = async (contactEmail: string) => {
        await fetchContactRequest(contactEmail, ContactRequestActions.SEND)
    }
    const handleContactRequestModalAction = async (contactEmail: string, selection: ContactRequestModalActionType) => {
        if (selection.accept || selection.reject) {
            await fetchContactRequest(contactEmail,
                selection.accept ? ContactRequestActions.ACCEPT : ContactRequestActions.REJECT
            )
        } else {
            alert('Invalid selection')
        }
    }

    const fetchContactRequest = async (contactEmail: string, action: ContactRequestActions) => {
        try {
            const response = await fetch(`/user/contact-request/${action}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contactEmail: contactEmail
                })
            })
            const data = await response.json()

            if (response.ok) {
                console.log(data)
                // setUserData(data.user)
            }
            // TODO: manage error correctly
            if (data.error) {
                alert(data.error)
            }
        }
        catch (err) {
            console.error(err)
        }
    }


    return (
        <div className="home">
            <div className="home__wrapper window">
                <div className="home__window-title title-bar">
                    <img className="home__window-title-img" src={msnLogo} alt="MSN logo" />
                    <p className="home__window-title-text">Windows Messenger</p>
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
                            handleModalAction={ handleContactRequestModalAction }
                        />
                    </div>
                    <div className="home__contact-list">
                        <ContactList contacts={userData.contacts}/>
                    </div>
                    <div className="home__footer">
                        <HomeFooter />
                    </div>
                    {/* <SearchBar handleSubmit={sendContactRequest} /> */}
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