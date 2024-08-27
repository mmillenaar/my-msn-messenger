import { CSSProperties, useContext, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { openChat, sendMessage, setupChatListener, setupTypingListener } from '../utils/websocket'
import { ChatMessageForServer, ChatMessageType, ChatType, ContactType } from '../utils/types'
import ChatMessage from '../components/ChatMessage/ChatMessage'
import Context from '../context/AppContext'
import MessageForm from '../components/MessageForm/MessageForm'
import chatIcon from '../assets/icons/start-chat.png'
import userIcon from '../assets/icons/user-avatar.png'
import { chatBoxText, informationBoxHasBlockedMeText, informationBoxIsBlockedText, informationBoxOfflineText } from '../utils/constants'
import WindowTitleBar from '../components/WindowTitleBar/WindowTitleBar'
import ChatControls from '../components/ChatControls/ChatControls'
import '../styles/views/Chat.scss'

const Chat = () => {
    const [chatData, setChatData] = useState<ChatType | null>(null)
    const [chatId, setChatId] = useState<string | undefined>(undefined)
    const [contactData, setContactData] = useState<ContactType | undefined>(undefined)
    const [isContactTyping, setIsContactTyping] = useState<boolean>(false)
    const [currentMessageFont, setCurrentMessageFont] = useState<CSSProperties | undefined>(undefined)
    const { userData, handleUserBlockage } = useContext(Context)
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

    const sendNudge = () => {
        const nudgeMessage: ChatMessageForServer = {
            text: '',
            timestamp: Date.now(),
            senderId: userData?.id ? userData.id : '',
            recipientId: contactId ? contactId : '',
            isNudgeMessage: true
        }

        sendMessage(nudgeMessage, chatId)
    }

    const checkInformationBoxRender = () => {
        return contactData?.status === 'Offline' || contactData?.hasBlockedMe || contactData?.isBlocked
    }
    const returnInformationBoxText = () => {
        if (contactData?.isBlocked) return informationBoxIsBlockedText
        if (contactData?.hasBlockedMe) return informationBoxHasBlockedMeText
        if (contactData?.status === 'Offline') return informationBoxOfflineText
    }

    return (
        <div className="chat">
            <div className="chat__wrapper window">
                <div className="chat__header">
                    <div className="chat__header-title">
                        <WindowTitleBar
                            title={`${contactData?.username} - Conversation`}
                            icon={chatIcon}
                            hasControls={true}
                        />
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
                    {
                        checkInformationBoxRender() &&
                        <div className="chat-box__information-box">
                            <p className="chat-box__information-box-text">
                                { returnInformationBoxText() }
                            </p>
                        </div>
                    }
                    <div className="chat-box__messages">
                        {chatData?.messages && chatData.messages.map((messageData: ChatMessageType, index) => {
                            const { text, timestamp, sender, fontStyle, isNudgeMessage } = messageData

                            return (
                                <div className="chat-box__chat-message" key={index}>
                                    <ChatMessage
                                        userId={userData?.id ? userData.id : ''}
                                        senderUsername={sender.username}
                                        senderId={sender.id}
                                        text={text}
                                        timestamp={timestamp}
                                        fontStyle={fontStyle}
                                        isNudge={isNudgeMessage}
                                    />
                                </div>
                            )
                        })}
                        <div ref={bottomRef} className="char-box__messages-bottom"  />
                    </div>
                </div>
                <div className="chat__controls">
                    <ChatControls
                        messageFontStyle={currentMessageFont}
                        onApplyMessageStyle={setCurrentMessageFont}
                        onNudgeClick={sendNudge}
                        isContactBlocked={contactData?.isBlocked || false}
                        onBlockClick={() =>
                            handleUserBlockage(
                                contactId ? contactId : '',
                                contactData?.isBlocked || false
                            )
                        }
                        hasContactBlockedMe={contactData?.hasBlockedMe}
                    />
                </div>
                <div className="chat__input">
                    {userData && contactId &&
                        <MessageForm
                            userId={userData.id}
                            contactId={contactId}
                            chatId={chatId}
                            currentFontStyle={currentMessageFont}
                            disabled={contactData?.isBlocked || contactData?.hasBlockedMe}
                        />
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