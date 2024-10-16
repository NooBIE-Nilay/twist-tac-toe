import { useEffect, useState } from "react"
import { Routes, Route, BrowserRouter } from "react-router-dom"
import { ThemeProvider } from "@/components/util/themeProvider"
import { Appbar } from "@/components/Appbar"
import { Landing } from "@/components/pages/Landing"
import Colors from "@/components/pages/Colors"
import { Game } from "@/components/pages/Game"
import { Create } from "@/components/pages/Create"
import { Join } from "@/components/pages/Join"
import { socket } from "./socket"
import { GameJoinedEventType } from "../../common/types"

function App() {
    const username = "NooBIE_" + Math.floor(Math.random() * 100)
    const [sign, setSign] = useState("")
    const [turn, setTurn] = useState(false)
    const [gameJoinedEvents, setGameJoinedEvents] = useState<
        GameJoinedEventType[]
    >([])
    const [timeEvent, setTimeEvent] = useState({ lastMoveTimeInSeconds: 0 })
    const [moveEvent, setMoveEvent] = useState({
        move: "",
        id: "",
        username: "",
    })
    const [removeEvent, setRemoveEvent] = useState({
        move: "",
    })
    const [winEvent, setWinEvent] = useState({
        winner: "",
        id: "",
        message: "",
    })
    function resetGame() {
        setWinEvent({ winner: "", id: "", message: "" })
        setMoveEvent({
            move: "",
            id: "",
            username: "",
        })
        setTimeEvent({ lastMoveTimeInSeconds: 0 })
        setSign("")
        setTurn(false)
    }
    function gameJoinedHandler(data: GameJoinedEventType) {
        if (gameJoinedEvents.length === 0) resetGame()
        setGameJoinedEvents((prev) => [...prev, data])
    }
    function initHandler(data: { id: string; sign: string }) {
        console.log("Init", data)
        if (data.id === socket.id) {
            setSign((sign) => {
                console.log("Sign Updated  from ", sign, "to ", data.sign)
                return data.sign
            })
            if (data.sign === "X") setTurn(true)
            else if (data.sign === "O") setTurn(false)
        }
    }
    function moveHandler(data: { move: string; id: string; username: string }) {
        if (socket.id !== data.id) {
            setMoveEvent({ ...data })
            setTurn((turn) => !turn)
        }
    }
    function removeHandler(data: { move: string }) {
        console.log("Remove", data)
        setRemoveEvent({ ...data })
    }
    function winHandler(data: { winner: string; id: string; message: string }) {
        setWinEvent(data)
        console.log(data.message)
        setGameJoinedEvents([])
    }
    function timeHandler(data: { lastMoveTimeInSeconds: number }) {
        setTimeEvent(data)
        console.log("Time", timeEvent)
    }
    useEffect(() => {
        if (!socket.connected) socket.connect()
        socket.on("time", timeHandler)
        return () => {
            socket.off("time", timeHandler)
        }
    }, [gameJoinedEvents, moveEvent])
    useEffect(() => {
        socket.on("gameJoined", gameJoinedHandler)
        socket.on("init", initHandler)
        return () => {
            socket.off("gameJoined", gameJoinedHandler)
            socket.off("init", initHandler)
        }
    }, [gameJoinedEvents])
    useEffect(() => {
        socket.on("move", moveHandler)
        socket.on("remove", removeHandler)
        return () => {
            socket.off("move", moveHandler)
            socket.off("remove", removeHandler)
        }
    }, [moveEvent])
    useEffect(() => {
        socket.on("win", winHandler)

        return () => {
            socket.off("win", winHandler)
        }
    }, [winEvent])
    return (
        <>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <Appbar username={username} />
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route
                            path="/create"
                            element={
                                <Create
                                    username={username}
                                    events={gameJoinedEvents}
                                    randomGame={false}
                                />
                            }
                        />
                        <Route
                            path="/create_random"
                            element={
                                <Create
                                    username={username}
                                    events={gameJoinedEvents}
                                    randomGame
                                />
                            }
                        />
                        <Route
                            path="/join"
                            element={
                                <Join
                                    username={username}
                                    events={gameJoinedEvents}
                                />
                            }
                        />
                        <Route
                            path="/join/:joinId"
                            element={
                                <Join
                                    username={username}
                                    events={gameJoinedEvents}
                                />
                            }
                        />
                        <Route
                            path="/game/:gameId"
                            element={
                                <Game
                                    sign={sign}
                                    moveEvent={moveEvent}
                                    removeEvent={removeEvent}
                                    turnState={[turn, setTurn]}
                                    winEvent={winEvent}
                                    timeEvent={timeEvent}
                                />
                            }
                        />
                        <Route path="/colors" element={<Colors />} />
                        <Route path="*" element={<div>Not Found</div>} />
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </>
    )
}

export default App
