import { CSSProperties, useRef, useState } from "react"
import { ChatMessageForServer } from "../../utils/types"
import { notifyTyping, sendMessage } from "../../utils/websocket"
import './MessageForm.scss'

interface MessageFormProps {
    userId: string;
    contactId: string;
    chatId?: string;
    currentFontStyle?: CSSProperties;
    disabled?: boolean;
}

const MessageForm = ({ userId, contactId, chatId, currentFontStyle, disabled }: MessageFormProps) => {
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
                fontStyle: currentFontStyle ? JSON.stringify(currentFontStyle) : undefined
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
                    style={currentFontStyle}
                    disabled={disabled}
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