import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { socket } from "../../socket"
import { MagicCard } from "@/components/magicui/magic-card"
import { useTheme } from "@/components/util/themeProvider"
import { Loading } from "@/components/ui/loading"
import { GameHeading } from "@/components/GameHeading"
import { CopyButton } from "@/components/CopyButton"
import { GameJoinedEventType } from "../../../../common/types"

export function Create({
    username,
    events,
    randomGame = false,
}: {
    username: string
    events: GameJoinedEventType[]
    randomGame: boolean
}) {
    const navigate = useNavigate()
    const [gameId, setGameId] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [copyStatus, setCopyStatus] = useState("Copy")
    const [message, setMessage] = useState("")
    useEffect(() => {
        if (randomGame) {
            socket.emit("joinRandomGame", { username })
            return
        }
        socket.emit("createGame", { username })
    }, [])
    useEffect(() => {
        events.forEach((event) => {
            if (event.id === socket.id) {
                console.log(event)
                console.log(socket.id)
                setIsLoading(false)
                setGameId(event.gameId)
                setMessage(event.message)
                if (event.playersJoined >= 2) {
                    navigate(`/game/${event.gameId}`)
                }
            } else if (event.gameId === gameId && event.playersJoined >= 2) {
                console.log(
                    event.username,
                    " Joined the game!\nRedirecting to game page...",
                )
                navigate(`/game/${gameId}`)
            }
        })
    }, [events])
    const { theme } = useTheme()
    return (
        <div>
            <GameHeading />
            <div className="flex justify-center">
                <div>
                    <MagicCard
                        className="top-[50%] h-[280px] cursor-pointer flex-col items-center justify-center whitespace-nowrap p-4 py-0 text-2xl shadow-2xl md:w-[460px]"
                        gradientColor={
                            theme === "dark" ? "#262626" : "#D9D9D955"
                        }
                    >
                        <div className="flex flex-col items-center justify-center gap-6 text-wrap md:max-w-[350px]">
                            <span className="text-xl capitalize md:text-2xl">
                                Share this code with your friend:
                            </span>
                            <div className="hover: flex h-[80px] w-[260px] items-center justify-center rounded-md bg-secondary md:w-[350px]">
                                {isLoading ? (
                                    <Loading />
                                ) : (
                                    <div className="inline-flex items-center gap-x-3 text-2xl uppercase tracking-widest md:text-3xl">
                                        {" " + gameId}
                                        <CopyButton
                                            copyState={[
                                                copyStatus,
                                                setCopyStatus,
                                            ]}
                                            gameId={gameId}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="mt-3 flex items-center justify-center">
                            <span className="text-lg md:text-xl">
                                {message}
                            </span>
                        </div>
                    </MagicCard>
                </div>
            </div>
        </div>
    )
}
