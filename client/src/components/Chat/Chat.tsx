import { useEffect, useState } from 'react'
import { ChatMessage } from '../../utils/types'
import Message from './Message/Message'
import socket from '../../utils/websocket'

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
                const {username, message, date} = messageData
                return (
                    <Message
                        key={date}
                        username={username}
                        message={message}
                        date={date}
                    />
                )
            })}
        </div>
    )
}

export default Chat