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
                        className="top-[50%] h-[280px] w-[460px] cursor-pointer flex-col items-center justify-center whitespace-nowrap text-2xl shadow-2xl"
                        gradientColor={
                            theme === "dark" ? "#262626" : "#D9D9D955"
                        }
                    >
                        <div className="flex max-w-[350px] flex-col gap-6 text-wrap">
                            <span className="capitalize">
                                Share this code with your friend:
                            </span>
                            <div className="hover: flex h-[80px] w-[350px] items-center justify-center rounded-md bg-secondary">
                                {isLoading ? (
                                    <Loading />
                                ) : (
                                    <div className="inline-flex items-center gap-x-3 text-3xl uppercase tracking-widest">
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
                            <span className="text-xl">{message}</span>
                        </div>
                    </MagicCard>
                </div>
            </div>
        </div>
    )
}
