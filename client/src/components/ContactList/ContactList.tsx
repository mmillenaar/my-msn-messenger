import { ContactType } from "../../utils/types"
import ContactChatLink from "../ContactChatLink/ContactChatLink"

interface ContactListProps {
    contacts: ContactType[]
}

const ContactList = ({ contacts }: ContactListProps) => {

    return (
        <div className="contact-list">
            <div className="contact-list__wrapper">
                {contacts.map((contact, index) => {
                    return (
                        <ContactChatLink
                            key={index}
                            id={contact.id}
                        >
                            {contact.username}
                        </ContactChatLink>
                    )
                })}
            </div>
        </div>
    )
}

export default ContactList