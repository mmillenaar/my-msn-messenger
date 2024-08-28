import { userStatusItems } from "../../utils/constants"
import { ContactType, TabType } from "../../utils/types"
import ContactGroup from "../ContactGroup/ContactGroup"
import './ContactList.scss'

interface ContactListProps {
    contacts: ContactType[]
    handleContactClick: (newTab: TabType) => void
}

const ContactList = ({ contacts, handleContactClick }: ContactListProps) => {
    const contactStatusGroup: {
        [key: string]: ContactType[];
    } = {}
    contacts.forEach(contact => {
        const group = contact.isBlocked ? 'Blocked' : contact.status
        if (!contactStatusGroup[group]) {
            contactStatusGroup[group] = []
        }
        contactStatusGroup[group].push(contact)
    })

    const statusGroupNames = Object.keys(contactStatusGroup)
    const sortedGroupNames = statusGroupNames.sort((a, b) => {
        const statusItemA = userStatusItems.find(item => item.text === a)
        const statusItemB = userStatusItems.find(item => item.text === b)

        if (statusItemA && statusItemB) {
            return statusItemA?.priority - statusItemB?.priority
        } else {
            return 0
        }
    })

    return (
        <div className="contact-list">
            <div className="contact-list__wrapper">
                {sortedGroupNames.map((groupName, index) => {
                    return (
                        <ContactGroup
                            key={index}
                            groupTitle={groupName}
                            contacts={contactStatusGroup[groupName]}
                            handleContactClick={handleContactClick}
                        />
                    )
                })}
            </div>
        </div>
    )
}

export default ContactList