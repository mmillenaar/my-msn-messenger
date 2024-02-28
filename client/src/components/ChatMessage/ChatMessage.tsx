import './ChatMessage.scss'

interface ChatMessageProps {
    username: string;
    text: string;
    timestamp: number;
}

const ChatMessage = ({username, text, timestamp}: ChatMessageProps) => {
    return (
        <div className="chat-message">
            <div className="chat-message__wrapper">
                <p className="chat-message__username">{username} says:</p>
                <p className="chat-message__text"> {text}</p>
            </div>
        </div>
    )
}

export default ChatMessage