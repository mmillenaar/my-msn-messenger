import { io } from 'socket.io-client'

const socket = io('http://localhost:3030')
console.log('hola')

export default socket