import { ChangeEvent, useState } from "react";
import { ContactRequestModalActionType, ContactType } from "../../utils/types";

interface ContactRequestModalProps {
    contactRequest: ContactType;
    isOpen: boolean;
    handleClose: () => void;
    handleModalAction: (ContactEmail: string, action: ContactRequestModalActionType) => void;
}

const ContactRequestModal = ({ contactRequest, isOpen, handleClose, handleModalAction }: ContactRequestModalProps) => {
    const [selection, setSelection] = useState({
        accept: false,
        reject: false,
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setSelection({
            accept: false,
            reject: false,
            [name]: checked,
        });
    };

    const handleModalOkClick = async () => {
        // wait for function to finish before closing the modal
        await handleModalAction(contactRequest.email, selection);
        handleClose();
        setSelection({
            accept: false,
            reject: false,
        });
    }

    if (!isOpen) return null

    return (
        <div className="contact-request-modal">
            <div className="contact-request-modal__wrapper">
                <div className="contact-request-modal__icon">

                </div>
                <div className="contact-request-modal__text">
                    <p className="contact-request-modal__title">
                        {contactRequest.username} ({contactRequest.email}) wants to be your contact
                    </p>
                    <div className="contact-request-modal__checkbox">
                        <div className="contact-request-modal__checkbox-option">
                            <input
                                type="checkbox"
                                name="accept"
                                checked={selection.accept}
                                onChange={handleChange}
                            />
                            <label>Yes, add to my contact list</label>
                        </div>
                        <div className="contact-request-modal__checkbox-option">
                            <input
                                type="checkbox"
                                name="reject"
                                checked={selection.reject}
                                onChange={handleChange}
                            />
                            <label>No, thanks</label>
                        </div>
                    </div>
                </div>
                <div className="contact-request-modal__buttons">
                    <button onClick={handleClose}>Cancel</button>
                    <button onClick={handleModalOkClick}>
                        Ok
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ContactRequestModal