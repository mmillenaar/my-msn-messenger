import { userStatusItems } from "../../utils/constants"
import { ContactType } from "../../utils/types"
import ContactGroup from "../ContactGroup/ContactGroup"
import './ContactList.scss'

interface ContactListProps {
    contacts: ContactType[]
}

const ContactList = ({ contacts }: ContactListProps) => {
    const contactStatusGroup: {
        [key: string]: ContactType[];
    } = {}
    contacts.forEach(contact => {
        const group = contact.status
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
            return 0 // TODO: check if OK to assing 0
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
                        />
                    )
                })}
            </div>
        </div>
    )
}

export default ContactList