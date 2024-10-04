import { io } from "socket.io-client"
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
const URL = `${BACKEND_URL || "http://localhost:8080"}`

export const socket = io(URL)
