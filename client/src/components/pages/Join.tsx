import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { socket } from "@/socket"
import { GameHeading } from "@/components/GameHeading"
import { InputCodePattern } from "@/components/InputCodePattern"
import { MagicCard } from "../magicui/magic-card"
import { useTheme } from "../util/themeProvider"
import { Loading } from "../ui/loading"
import { Button } from "../ui/button"
import { GameJoinedEventType } from "../../../../common/types"

export function Join({
    username,
    events,
}: {
    username: string
    events: GameJoinedEventType[]
}) {
    const [gameId, setGameId] = useState(
        useParams().joinId?.toUpperCase() || "",
    )
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")
    const navigate = useNavigate()
    const { theme } = useTheme()

    useEffect(() => {
        events.forEach((event) => {
            console.log(event)
            if (event.id === socket.id && gameId === event.gameId) {
                setIsLoading(false)
                navigate(`/game/${event.gameId}`)
            }
        })
    }, [events])
    function joinGame() {
        if (!socket.connected) socket.connect()
        if (!gameId) {
            setIsError(true)
            setErrorMsg("Please Enter A Game Code!")
            setTimeout(() => {
                setIsError(false)
                setErrorMsg("")
            }, 2500)
            return
        }
        setIsLoading(true)
        setIsError(false)
        socket.emit("joinGame", { username, gameId: gameId.toUpperCase() })
        setTimeout(() => {
            setIsLoading(false)
            setIsError(true)
            setErrorMsg("GameID not found")
            setTimeout(() => {
                setIsError(false)
            }, 2000)
        }, 3000)
        return () => {
            socket.disconnect()
        }
    }
    return (
        <div>
            <GameHeading />
            <div className="flex justify-center">
                <div>
                    <MagicCard
                        className="top-[50%] cursor-pointer flex-col items-center justify-center whitespace-nowrap p-6 text-2xl shadow-2xl md:h-[280px]"
                        gradientColor={
                            theme === "dark" ? "#262626" : "#D9D9D955"
                        }
                    >
                        <div className="flex flex-col justify-center gap-2 text-wrap md:gap-6">
                            <span className="text-lg capitalize md:text-4xl">
                                Enter Game Code:
                            </span>
                            <div className="flex flex-col items-center justify-center gap-4 md:inline-flex md:flex-row">
                                <div>
                                    <InputCodePattern
                                        setCode={setGameId}
                                        value={gameId.toUpperCase()}
                                    />
                                </div>
                                <div>
                                    <Button
                                        variant="outline"
                                        onClick={joinGame}
                                    >
                                        Join Game
                                    </Button>
                                </div>
                            </div>
                            {isLoading && <Loading />}
                            {isError && (
                                <div className="flex items-center justify-start text-xl capitalize text-red-500/90">
                                    {errorMsg}
                                </div>
                            )}
                        </div>
                    </MagicCard>
                </div>
            </div>
        </div>
    )
}
