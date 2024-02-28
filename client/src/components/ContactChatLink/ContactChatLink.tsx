import { Link } from "react-router-dom";

interface ContactChatLinkProps {
    id: string;
    children: React.ReactNode;
}

const ContactChatLink = ({ id, children }: ContactChatLinkProps) => {

    return (
        <Link to={`/chat/${id}`} className="contact-chat-link">
            {children}
        </Link>
    )
}

export default ContactChatLink;