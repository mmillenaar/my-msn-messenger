import { useState } from "react";
import { ContactRequestModalActionType, ContactRequestType } from "../../utils/types";
import ContactRequestModal from "../ContactRequestModal/ContactRequestModal";

interface ContactRequestsBarProps {
    contactRequests: ContactRequestType[] | null;
    handleModalAction: (contactEmail: string, action: ContactRequestModalActionType) => void;
}

const ContactRequestsBar = ({ contactRequests, handleModalAction }: ContactRequestsBarProps) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

    if (!contactRequests) return null

    return (
        <div className="contact-requests-bar">
            <div className="contact-requests-bar__wrapper">
                <div
                    className="contact-requests-bar__text"
                    onClick={() => setIsModalOpen(true)}
                >
                    You have {contactRequests.length} invitation{contactRequests.length === 1 ? '' : 's'}
                </div>
                {isModalOpen && contactRequests.map((contactRequest, index) => (
                    <ContactRequestModal
                        key={index}
                        contactRequest={contactRequest}
                        isOpen={isModalOpen}
                        handleClose={() => setIsModalOpen(false)}
                        handleModalAction={handleModalAction}
                    />
                ))}
            </div>
        </div>
    )
}

export default ContactRequestsBar;