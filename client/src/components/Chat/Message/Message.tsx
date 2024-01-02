import { ChatMessage } from "../../../utils/types"

const Message = ({ username, message, timestamp }: ChatMessage) => {

    return (
        <div className="chat-message">
            <div className="chat-message__wrapper">
                <p className="chat-message__username">{username}</p>
                <p className="chat-message__message">{message}</p>
                <p className="chat-message__date">{timestamp}</p>
            </div>
        </div>
    )
}

export default Message