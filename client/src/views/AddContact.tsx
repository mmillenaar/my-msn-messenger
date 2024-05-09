import { useContext, useState } from 'react'
import { useLocation } from 'react-router-dom'
import SearchBar from '../components/SearchBar/SearchBar'
import Context from '../context/AppContext'
import { ContactRequestActions, addContactEmailExamples, getAddContactErrorText, addContactFirstStepSubtitle, addContactSuccessText, getAddContactErrorSubtitle, getAddContactSuccessSubtitle, ContactErrorType } from '../utils/constants'
import microsoftDotNetImage from '../assets/images/microsoft-net.png'
import { useTabs } from '../context/TabContext'
import WindowLayout from '../components/WindowLayout/WindowLayout'
import '../styles/views/AddContact.scss'

const AddContactView = () => {
    const [contactEmail, setContactEmail] = useState<string>('')
    const [isProcessFirstStep, setIsProcessFirstStep] = useState<boolean>(true)
    const [isResponseSuccessful, setIsResponseSuccessful] = useState<boolean | null>(null)
    const [responseErrorCode, setResponseErrorCode] = useState<ContactErrorType | undefined>(undefined)
    const url = useLocation().pathname

    const { fetchContactRequest } = useContext(Context)
    const { removeTab } = useTabs()

    const handleSearchBarValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setContactEmail(e.target.value)
    }

    const sendContactRequest = async () => {
        const response = await fetchContactRequest(contactEmail, ContactRequestActions.SEND)
        setIsProcessFirstStep(false)

        if (!response.success) {
            setIsResponseSuccessful(false)
            setResponseErrorCode(response.errorType)
        } else {
            setIsResponseSuccessful(true)
        }
    }

    const backToHome = () => {
        removeTab(url)
    }

    return (
        <div className="add-contact-view">
            <WindowLayout
                hasControls
                title='Add a Contact'
            >
                <img src={microsoftDotNetImage} alt="Microsoft.net" className="add-contact-view__image" />
                <h3 className="add-contact-view__subtitle">
                    { isProcessFirstStep
                        ? addContactFirstStepSubtitle
                        : isResponseSuccessful
                            ? getAddContactSuccessSubtitle(contactEmail)
                            : getAddContactErrorSubtitle(contactEmail)
                    }
                </h3>
                {isProcessFirstStep ?
                    <div className="add-contact-view__search-bar">
                        <SearchBar
                            searchTerm={contactEmail}
                            type={'email'}
                            handleInputChange={handleSearchBarValueChange}
                        />
                    </div>
                    : null
                }
                <div className="add-contact-view__text">
                    <p className="add-contact-view__text-title">
                        {isProcessFirstStep
                            ? 'Example:'
                            : isResponseSuccessful
                                ? addContactSuccessText
                                : getAddContactErrorText(responseErrorCode)
                        }
                    </p>
                    { isProcessFirstStep ?
                        <div className="add-contact-view__text-examples">
                            {addContactEmailExamples.map((example, index) => {
                                return (
                                    <p key={index} className="add-contact-view__text-example">{example}</p>
                                )
                            })}
                        </div>
                        : ''
                    }
                </div>
                <div className="add-contact-view__footer">
                    <button
                        className="add-contact-view__footer-button add-contact-view__footer-button--next"
                        onClick={
                            isProcessFirstStep
                                ? sendContactRequest
                                : backToHome
                        }
                        disabled={contactEmail === '' || isResponseSuccessful === false}
                    >
                        { isProcessFirstStep ? 'Next' : 'Finish' }
                    </button>
                    <button
                        className="add-contact-view__footer-button add-contact-view__footer-button--cancel"
                        onClick={backToHome}
                    >
                        Cancel
                    </button>
                </div>
            </WindowLayout>
        </div>
    )
}

export default AddContactView