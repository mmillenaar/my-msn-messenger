import { useRef } from "react"
import { ChatMessageForServer } from "../../utils/types"
import { sendMessage } from "../../utils/websocket"
import { MessageStatus } from "../../utils/constants";

interface MessageFormProps {
    userId: string;
    contactId: string;
    chatId?: string;
}

const MessageForm = ({ userId, contactId, chatId }: MessageFormProps) => {
    const messageRef = useRef<HTMLInputElement | null>(null)

    const cleanForm = (elementsArray: HTMLInputElement[]) => {
        elementsArray.forEach(element => element.value = '')
    }

    const handleChatSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (messageRef.current) {
            const formMessage: ChatMessageForServer = {
                // FIXME: complete with new expected values
                text: messageRef.current.value,
                timestamp: Date.now(),
                senderId: userId,
                recipientId: contactId,
                status: MessageStatus.SENT
            }

            sendMessage(formMessage, chatId)
            console.log('message sent!');
            cleanForm([messageRef.current])
        }
    }

    return (
        <div className="message-form">
            <form onSubmit={handleChatSubmit}>
                <input ref={messageRef} type="text" id="message" placeholder="message" />
                <button type="submit">Send</button>
            </form>
        </div>
    )
}

export default MessageForm