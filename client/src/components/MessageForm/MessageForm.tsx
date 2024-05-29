import { useRef, useState } from "react"
import { ChatMessageForServer } from "../../utils/types"
import { notifyTyping, sendMessage } from "../../utils/websocket"
import { MessageStatus } from "../../utils/constants";
import './MessageForm.scss'

interface MessageFormProps {
    userId: string;
    contactId: string;
    chatId?: string;
}

const MessageForm = ({ userId, contactId, chatId }: MessageFormProps) => {
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true)
    const inputRef = useRef<HTMLTextAreaElement | null>(null)

    const handleInputChange = () => {
        if (inputRef.current?.value !== '') {
            setIsButtonDisabled(false)
            notifyTyping(true, contactId)
        } else {
            setIsButtonDisabled(true)
            notifyTyping(false, contactId)
        }
    }

    const cleanForm = (element: HTMLTextAreaElement) => {
        element.value = ''
        setIsButtonDisabled(true)
        notifyTyping(false, contactId)
    }

    const handleChatSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (inputRef.current && inputRef.current.value !== '') {
            const formMessage: ChatMessageForServer = {
                text: inputRef.current.value,
                timestamp: Date.now(),
                senderId: userId,
                recipientId: contactId,
                status: MessageStatus.SENT // TODO: check if we are going to use message status
            }

            sendMessage(formMessage, chatId)
            cleanForm(inputRef.current)
        }
    }

    const handleEnterKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleChatSubmit(e)
        }
    }

    return (
        <div className="message-form">
            <form onSubmit={handleChatSubmit}>
                <textarea
                    className="message-form__input"
                    ref={inputRef}
                    id="message"
                    onChange={handleInputChange}
                    onKeyDown={(e) => handleEnterKeyPress(e)}
                />
                <button
                    className={`message-form__button ${isButtonDisabled ? 'message-form__button--disabled' : ''}`}
                    type="submit"
                    disabled={isButtonDisabled}
                >
                    Send
                </button>
            </form>
        </div>
    )
}

export default MessageForm