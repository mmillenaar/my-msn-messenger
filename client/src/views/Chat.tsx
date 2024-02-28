import { useContext, useEffect, useState } from 'react'
import { openChat, setupChatListener } from '../utils/websocket'
import { ChatMessageType, ChatType, ContactType } from '../utils/types'
import ChatMessage from '../components/ChatMessage/ChatMessage'
import Context from '../Context/AppContext'
import MessageForm from '../components/MessageForm/MessageForm'
import { useParams } from 'react-router-dom'


const Chat = () => {
    const [chatData, setChatData] = useState<ChatType | null>(null)
    const [chatId, setChatId] = useState<string | undefined>(undefined)
    const { userData } = useContext(Context)
    const { contactId } = useParams()

    useEffect(() => {
        setupChatListener(setChatData)
    }, [])
    useEffect(() => {
        const contactChatId = chatData?.id || userData?.contacts.find((contact: ContactType) => contact.id === contactId)?.chatId

        if (contactChatId) {
            setChatId(contactChatId)
            openChat(contactChatId)
        }
    }, [contactId, chatData?.id, userData?.contacts])

    return (
        <div className="chat">
            {chatData?.messages && chatData.messages.map((messageData: ChatMessageType, index) => {
                const { text, timestamp, sender } = messageData
                return (
                    <ChatMessage
                        key={index}
                        username={sender.username}
                        text={text}
                        timestamp={timestamp}
                    />
                )
            })}
            {userData && contactId &&
                <MessageForm userId={userData.id} contactId={contactId} chatId={chatId} />
            }
        </div>
    )
}

export default Chat