import { ContactType, TabType } from "../../utils/types";
import addContactIcon from '../../assets/icons/plus-icon.png'
import msnIcon from '../../assets/icons/MSN-messenger-icon.webp'
import { useTabs } from "../../context/TabContext";
import './ContactRequestsBar.scss'

interface ContactRequestsBarProps {
    contactRequests: ContactType[] | null;
}

const ContactRequestsBar = ({ contactRequests }: ContactRequestsBarProps) => {
    const { addTab } = useTabs()

    if (!contactRequests) return null

    const handleClick = () => {
        contactRequests.forEach((contactRequest) => {
            const url = `/contact-request/${contactRequest.id}`
            const newTab: TabType = {
                id: url,
                path: url,
                label: `<${contactRequest.email}> - Contact Request`,
                icon: msnIcon
            }
            addTab(newTab)
        })
    }

    return (
        <div className="contact-requests-bar">
            <div
                className="contact-requests-bar__wrapper"
                onClick={handleClick}
            >
                <img src={addContactIcon} alt="" className="contact-requests-bar__icon" />
                <p className="contact-requests-bar__text">
                    You have {contactRequests.length} invitation{contactRequests.length === 1 ? '' : 's'}
                </p>
            </div>
        </div>
    )
}

export default ContactRequestsBar;