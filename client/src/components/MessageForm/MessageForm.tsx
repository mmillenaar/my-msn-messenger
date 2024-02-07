// import { useRef } from "react"
// import { ChatMessageTypes } from "../../utils/types"
// import { sendMessage } from "../../utils/websocket"

// const MessageForm = () => {
//     const usernameRef = useRef<HTMLInputElement | null>(null)
//     const messageRef = useRef<HTMLInputElement | null>(null)

//     const cleanForm = (elementsArray: HTMLInputElement[]) => {
//         elementsArray.forEach(element => element.value = '')
//     }

//     const handleChatSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();

//         if (usernameRef.current && messageRef.current) {
//             const formMessage: ChatMessageTypes = {
//                 // FIXME: complete with new expected values
//                 username: usernameRef.current.value,
//                 message: messageRef.current.value,
//                 timestamp: Date.now()
//             }

//             sendMessage(formMessage)
//             console.log('message sent!');
//             cleanForm([usernameRef.current, messageRef.current])
//         }
//     }

//     return (
//         <div className="message-form">
//             <form onSubmit={handleChatSubmit}>
//                 <input ref={usernameRef} type="text" id="username" placeholder="Please insert your username" required />
//                 <input ref={messageRef} type="text" id="message" placeholder="message" />
//                 <button type="submit">Send</button>
//             </form>
//         </div>
//     )
// }

export default {}