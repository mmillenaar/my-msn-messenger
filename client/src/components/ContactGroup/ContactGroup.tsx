import { useState } from 'react';
import { ContactType, TabType } from '../../utils/types';
import { userStatusItems } from '../../utils/constants';
import { ReactComponent as ChevronRightIcon } from '../../assets/icons/double-chevron-right.svg'
import chatIcon from '../../assets/icons/start-chat.png'
import ActionLink from '../ActionLink/ActionLink';
import './ContactGroup.scss';

interface ContactGroupProps {
    groupTitle: string;
    contacts: ContactType[];
    handleContactClick: (tab: TabType) => void;
}

const ContactGroup = ({ groupTitle, contacts, handleContactClick }: ContactGroupProps) => {
    const [isGroupOpen, setIsGroupOpen] = useState<boolean>(true)

    const handleGroupTitleClick = () => {
        setIsGroupOpen(prevState => !prevState)
    }

    const groupStatus = userStatusItems.find(status => status.text === groupTitle)

    return (
        <div className="contact-group">
            <div className="contact-group__wrapper">
                <div className="contact-group__title" onClick={handleGroupTitleClick}>
                    <div className={`contact-group__title-icon contact-group__title-icon${isGroupOpen ? '--open' : ''}`}>
                        <ChevronRightIcon />
                    </div>
                    <p className="contact-group__title-text">{ groupTitle }</p>
                </div>
                <div className="contact-group__contacts">
                    {isGroupOpen && contacts.map((contact, index) => {
                        const newTab: TabType = {
                            id: `/chat/${contact.id}`,
                            label: `${contact.username} - Conversation`,
                            icon: chatIcon,
                            path: `/chat/${contact.id}`
                        }
                        return (
                            <ActionLink
                                key={index}
                                text={contact.username}
                                imgSource={groupStatus?.icon}
                                imgAlt={groupStatus?.text}
                                handleClick={() => handleContactClick(newTab)}
                            />
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default ContactGroup