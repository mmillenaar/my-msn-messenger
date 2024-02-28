import { useContext, useEffect } from "react"
import Context from "../Context/AppContext"
import { setupContactRequestListener } from "../utils/websocket"
import SearchBar from "../components/SearchBar/SearchBar"
import ContactRequestsBar from "../components/ContactRequestsBar/ContactRequestsBar"
import { ContactRequestModalActionType } from "../utils/types"
import { ContactRequestActions } from "../utils/constants"
import ContactList from "../components/ContactList/ContactList"


const Home = () => {
    const { userData, isSocketConnected, checkUserLogin, setUserData, logout } = useContext(Context)

    useEffect(() => {
        if (isSocketConnected) {
            console.log('contact request socket listening')
            setupContactRequestListener(setUserData)
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
                setUserData(data.user)
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
            <div className="home__wrapper">
                <div className="home__navbar">

                </div>
                <h1 className="home__title">
                    Welcome {userData?.username}!
                </h1>
                <SearchBar handleSubmit={sendContactRequest} />
                <ContactList contacts={userData.contacts}/>
                <ContactRequestsBar
                    contactRequests={userData.contactRequests.received}
                    handleModalAction={ handleContactRequestModalAction }
                />
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