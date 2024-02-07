// import { useEffect, useState } from 'react'
// import Message from './Message/Message'
// import { setupChatListener } from '../../utils/websocket'
// import { ChatMessageTypes } from '../../utils/types'
// import './Chat.scss'


// const Chat = () => {
//     const [chatData, setChatData] = useState<ChatMessageTypes[]>([])

//     useEffect(() => {
//         setupChatListener(setChatData)
//     }, [])

//     return (
//         <div className="chat">
//             {chatData.map(messageData => {
//                 const {username, message, timestamp} = messageData
//                 return (
//                     <Message
//                         key={timestamp}
//                         username={username}
//                         message={message}
//                         timestamp={timestamp}
//                     />
//                 )
//             })}
//         </div>
//     )
// }

// export default Chat
export {}