import './ChatMessage.scss'

interface ChatMessageProps {
    userId: string;
    senderId: string;
    senderUsername: string
    text: string;
    timestamp: number;
    fontStyle?: string;
    isNudge?: boolean;
}

const ChatMessage = (
    { userId, senderId, senderUsername, text, timestamp, fontStyle, isNudge }: ChatMessageProps
) => {
    const getNudgeMessage = () => {
        if (userId === senderId) return 'You have just sent a nudge.'
        else return `${senderUsername} sent you a nudge`
    }

    return (
        <div className="chat-message">
            <div className="chat-message__wrapper">
                {isNudge
                    ? <div className="chat-message__nudge">
                        <div className="chat-message__nudge-border" />
                        <p className="chat-message__nudge-text">{getNudgeMessage()}</p>
                        <div className="chat-message__nudge-border" />
                    </div>
                    : <>
                        <p className="chat-message__username">{senderUsername} says:</p>
                        <p className="chat-message__text" style={fontStyle && JSON.parse(fontStyle)}> {text}</p>
                    </>
                }
            </div>
        </div>
    )
}

export default ChatMessage