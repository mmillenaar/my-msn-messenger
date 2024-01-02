import { useEffect, useState } from 'react'
import Message from './Message/Message'
import socket from '../../utils/websocket'
import { ChatMessage } from '../../utils/types'
import './Chat.scss'


const Chat = () => {
    const [chatData, setChatData] = useState<ChatMessage[]>([])

    useEffect(() => {
        socket.on('first-chat-render', async (chatData) => {
            try {
                setChatData(chatData);
            }
            catch (err) {
                console.error(err);
            }
        })
        socket.on('new-chat-message', async (newChatData) => {
            try {
                setChatData(newChatData);
            }
            catch (err) {
                console.error(err);
            }
        })

        return () => {
            socket.off('first-chat-render')
            socket.off('new-chat-message')
        }
    }, [])

    return (
        <div className="chat">
            {chatData.map(messageData => {
                const {username, message, timestamp} = messageData
                return (
                    <Message
                        key={timestamp}
                        username={username}
                        message={message}
                        timestamp={timestamp}
                    />
                )
            })}
        </div>
    )
}

export default Chat