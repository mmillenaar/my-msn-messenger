import { ContactType } from "../../utils/types"

interface ContactListProps {
    contacts: ContactType[]
}

const ContactList = ({ contacts }: ContactListProps) => {

    return (
        <div className="contact-list">
            <div className="contact-list__wrapper">
                {contacts.map((contact, index) => {
                    return (
                        <div className="contact-list__contact" key={index}>
                            <p className="contact__name">{contact.username}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default ContactList