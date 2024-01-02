import { useRef } from "react"
import { ChatMessage } from "../../utils/types"
import socket from "../../utils/websocket"

const MessageForm = () => {
    const usernameRef = useRef<HTMLInputElement | null>(null)
    const messageRef = useRef<HTMLInputElement | null>(null)

    const cleanForm = (elementsArray: HTMLInputElement[]) => {
        elementsArray.forEach(element => element.value = '')
    }

    const handleChatSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (usernameRef.current && messageRef.current) {
            const formMessage: ChatMessage = {
                username: usernameRef.current.value,
                message: messageRef.current.value,
                timestamp: new Date().toISOString() // TODO: in which format should dates be stored in DB?
            }
            socket.emit('new-user-message', formMessage)
            console.log('message sent!');
            cleanForm([usernameRef.current, messageRef.current])
        }
    }

    return (
        <div className="message-form">
            <form onSubmit={handleChatSubmit}>
                <input ref={usernameRef} type="text" id="username" placeholder="Please insert your username" required />
                <input ref={messageRef} type="text" id="message" placeholder="message" />
                <button type="submit">Send</button>
            </form>
        </div>
    )
}

export default MessageForm