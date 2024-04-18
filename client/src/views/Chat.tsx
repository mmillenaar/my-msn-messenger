import { useContext, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { openChat, setupChatListener, setupTypingListener } from '../utils/websocket'
import { ChatMessageType, ChatType, ContactType } from '../utils/types'
import ChatMessage from '../components/ChatMessage/ChatMessage'
import Context from '../context/AppContext'
import MessageForm from '../components/MessageForm/MessageForm'
import chatIcon from '../assets/icons/start-chat.png'
import blockedUser from '../assets/icons/avatar-blocked.png'
import userIcon from '../assets/icons/user-avatar.png'
import { chatBoxText } from '../utils/constants'
import '../styles/views/Chat.scss'

const Chat = () => {
    const [chatData, setChatData] = useState<ChatType | null>(null)
    const [chatId, setChatId] = useState<string | undefined>(undefined)
    const [contactData, setContactData] = useState<ContactType | undefined>(undefined)
    const [isContactTyping, setIsContactTyping] = useState<boolean>(false)
    const { userData } = useContext(Context)
    const { contactId } = useParams()

    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setupChatListener(setChatData)
        setupTypingListener(setIsContactTyping)
    }, [])

    useEffect(() => {
        const contact = userData?.contacts.find((contact: ContactType) => contact.id === contactId)
        const contactChatId = contact?.chatId || chatData?.id

        if (contactChatId) {
            setChatId(contactChatId)
            openChat(contactChatId)
        }
        if (contact) {
            setContactData(contact)
        }
    }, [contactId, chatData?.id, userData?.contacts])

    useEffect(() => {
        scrollToLastMessage()
    }, [chatData?.messages])

    const getContactLastMessageTimestamp = () => {
        const contactMessages = chatData?.messages.filter((message: ChatMessageType) => message.sender.id === contactId)

        if (!contactMessages) return

        const lastMessage = contactMessages[contactMessages.length - 1]?.timestamp
        const formattedTimestamp = new Date(lastMessage).toLocaleString(
            'en-US', {
                day: 'numeric',
                month: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: false
            }
        ).replace(',', ' at').replaceAll('/', '.')

        return formattedTimestamp
    }

    const scrollToLastMessage = () => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <div className="chat">
            <div className="chat__wrapper window">
                <div className="chat__header">
                    <div className="chat__header-title title-bar">
                        <img className="title-bar__img" src={chatIcon} alt="MSN logo" />
                        <h1 className="title-bar__text">{contactData?.username} - Conversation</h1>
                    </div>
                    <h2 className="chat__header-subtitle">
                        To: {contactData?.username} {`<${contactData?.email}>`}
                    </h2>
                </div>
                <div className="chat__chat-box">
                    <div className="chat-box__warning">
                        <img src={userIcon} alt="" className="chat-box__warning-image" />
                        <p className="chat-box__warning-text">{chatBoxText}</p>
                    </div>
                    <div className="chat-box__separator" />
                    <div className="chat-box__messages">
                        {chatData?.messages && chatData.messages.map((messageData: ChatMessageType, index) => {
                            const { text, timestamp, sender } = messageData
                            return (
                                <div className="chat-box__chat-message" key={index}>
                                    <ChatMessage
                                        username={sender.username}
                                        text={text}
                                        timestamp={timestamp}
                                    />
                                </div>
                            )
                        })}
                        <div ref={bottomRef} className="char-box__messages-bottom"  />
                    </div>
                </div>
                <div className="chat__controls chat-controls">
                    <div className="chat-controls__block">
                        <img src={blockedUser} alt="Block" className="chat-controls__block-image" />
                        <p className="chat-controls__block-text">Block</p>
                    </div>
                    <div className="chat-controls__font chat-controls">
                        <span className="chat-controls__font-icon">A</span>
                        <p className="chat-controls__font-text">Font</p>
                    </div>
                </div>
                <div className="chat__input">
                    {userData && contactId &&
                        <MessageForm userId={userData.id} contactId={contactId} chatId={chatId} />
                    }
                </div>
                <div className="chat__status-bar status-bar">
                    {isContactTyping &&
                        <img src={chatIcon} alt="User typing icon" className="status-bar__image" />
                    }
                    <p className="status-bar__text">
                        {
                            isContactTyping ? `${contactData?.username} is typing a message.` :
                            contactData?.chatId ?
                            `Last message received on: ${getContactLastMessageTimestamp()}`
                            : ''
                        }
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Chat