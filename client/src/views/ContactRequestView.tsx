import WindowLayout from "../components/WindowLayout/WindowLayout"
import userAvatar from '../assets/icons/user-avatar.png'
import { useParams } from "react-router-dom"
import { ChangeEvent, useContext, useState } from "react"
import Context from "../context/AppContext"
import msnIcon from '../assets/icons/MSN-messenger-icon.webp'
import { ContactRequestActions, contactRequestViewCheckboxOptions } from "../utils/constants"
import { useTabs } from "../context/TabContext"
import CheckboxOptions from "../components/CheckboxOptions/CheckboxOptions"
import '../styles/views/ContactrequestView.scss'

interface Selection {
    [key: string]: boolean
}

const ContactRequestView = () => {
    const [selection, setSelection] = useState<Selection>({
        accept: false,
        reject: false,
    })

    const { contactId } = useParams()
    const { userData, fetchContactRequest } = useContext(Context)
    const { removeTab } = useTabs()

    const contact = userData?.contactRequests.received.find(contact => contact.id === contactId)

    const handleCheckboxOptionsChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setSelection({
            accept: false,
            reject: false,
            [name]: checked,
        })
    }

    const handleSubmit = async () => {
        if ((selection.accept || selection.reject) && contact) {
            await fetchContactRequest(contact.email,
                selection.accept ? ContactRequestActions.ACCEPT : ContactRequestActions.REJECT
            )
            setSelection({
                accept: false,
                reject: false,
            })
            removeTab(`/contact-request/${contactId}`)
        } else {
            alert('Invalid selection')
        }
    }

    const handleCancelClick = () => {
        setSelection({
            accept: false,
            reject: false,
        })
        removeTab(`/contact-request/${contactId}`)
    }

    const setupOptionsForCheckboxes = () => {
        const optionsWithSelectionState = contactRequestViewCheckboxOptions.map(option => {
            return {
                ...option,
                checked: selection[option.name],
            }
        })

        return optionsWithSelectionState
    }

    return (
        <div className="contact-request-view">
            <WindowLayout
                title={`<${contact?.email}> - Contact Request`}
                titleIcon={userAvatar}
                hasControls={true}
            >
                <div className="contact-request-view__title">
                    <img src={msnIcon} alt="" className="contact-request-view__title-image" />
                    <p className="contact-request-view__title-text">
                        {`${contact?.username} (${contact?.email}) has added you to their contact list`}
                    </p>
                </div>
                <div className="contact-request-view__content">
                    <p className="contact-request-view__content-text">
                        Do you want to:
                    </p>
                    <div className="contact-request-view__options">
                        <CheckboxOptions
                            options={setupOptionsForCheckboxes()}
                            handleChange={handleCheckboxOptionsChange}
                        />
                    </div>
                    <p className="contact-request-view__content-text">
                        Remember that you can appear offline at any time.
                    </p>
                </div>
                <div className="contact-request-view__buttons">
                    <button
                        className="contact-request-view__button"
                        disabled={!selection.accept && !selection.reject}
                        onClick={handleSubmit}
                    >
                        OK
                    </button>
                    <button
                        className="contact-request-view__button"
                        onClick={handleCancelClick}
                    >
                        Cancel
                    </button>
                </div>
            </WindowLayout>
        </div>
    )
}

export default ContactRequestView