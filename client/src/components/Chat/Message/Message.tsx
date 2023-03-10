import { ChatMessage } from "../../../utils/types"

const Message = ({ username, message, date }: ChatMessage) => {

    return (
        <div className="chat-message">
            <div className="chat-message__wrapper">
                <p className="chat-message__username">{username}</p>
                <p className="chat-message__message">{message}</p>
                <p className="chat-message__date">{date}</p>
            </div>
        </div>
    )
}

export default Message