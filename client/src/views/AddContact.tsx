import { useContext, useState } from 'react'
import { useLocation } from 'react-router-dom'
import SearchBar from '../components/SearchBar/SearchBar'
import WindowTitleBar from '../components/WindowTitleBar/WindowTitleBar'
import Context from '../context/AppContext'
import { ContactRequestActions, addContactEmailExamples, getAddContactErrorText, addContactFirstStepSubtitle, addContactSuccessText, getAddContactErrorSubtitle, getAddContactSuccessSubtitle, ContactErrorType } from '../utils/constants'
import microsoftDotNetImage from '../assets/images/microsoft-net.png'
import { useTabs } from '../context/TabContext'
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
            <div className="add-contact-view__wrapper window">
                <div className="add-contact-view__title">
                    <WindowTitleBar
                        title='Add a Contact'
                        hasControls={true}
                    />
                </div>
                <div className="add-contact-view__content">
                    <img src={microsoftDotNetImage} alt="Microsoft.net" className="add-contact-view__content-image" />
                    <h3 className="add-contact-view__content-subtitle">
                        { isProcessFirstStep
                            ? addContactFirstStepSubtitle
                            : isResponseSuccessful
                                ? getAddContactSuccessSubtitle(contactEmail)
                                : getAddContactErrorSubtitle(contactEmail)
                        }
                    </h3>
                    {isProcessFirstStep ?
                        <div className="add-contact-view__content-search-bar">
                            <SearchBar
                                searchTerm={contactEmail}
                                type={'email'}
                                handleInputChange={handleSearchBarValueChange}
                            />
                        </div>
                        : null
                    }
                    <div className="add-contact-view__content-text">
                        <p className="content-text__title">
                            {isProcessFirstStep
                                ? 'Example:'
                                : isResponseSuccessful
                                    ? addContactSuccessText
                                    : getAddContactErrorText(responseErrorCode)
                            }
                        </p>
                        { isProcessFirstStep ?
                            <div className="content-text__examples">
                                {addContactEmailExamples.map(example => {
                                    return (
                                        <p className="content-text__example">{example}</p>
                                    )
                                })}
                            </div>
                            : ''
                        }
                    </div>
                    <div className="add-contact-view__content-footer">
                        <button
                            className="content-footer__button content-footer__button--next"
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
                            className="content-footer__button content-footer__button--cancel"
                            onClick={backToHome}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddContactView