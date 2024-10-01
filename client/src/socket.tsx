import { io } from "socket.io-client"

//const URL = "https://localhost:3001"
const URL = "https://api.nilaycodes.in"

export const socket = io(URL)
