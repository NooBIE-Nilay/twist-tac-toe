import { socket } from "@/socket"
import React, { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import { GameHeading } from "../GameHeading"
import SparklesText from "../magicui/sparkles-text"

export function Game({
    sign,
    moveEvent,
    turnState,
    winEvent,
}: {
    sign: string
    moveEvent: { move: string; id: string; username: string; type: string }
    turnState: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
    winEvent: { winner: string; id: string; message: string }
}) {
    const navigate = useNavigate()
    const { gameId } = useParams()
    const [turn, setTurn] = turnState
    useEffect(() => {
        if (sign === "") {
            sign = turn ? "X" : "O"
        }
    }, [])
    useEffect(() => {
        const cell = document.getElementById(moveEvent.move) || {
            innerText: "",
        }
        if (moveEvent.type === "move") {
            cell.innerText = sign === "X" ? "O" : "X"
        } else if (moveEvent.type === "remove") {
            cell.innerText = ""
        }
    }, [moveEvent])
    useEffect(() => {
        if (!winEvent.winner || winEvent.winner === "") return
        console.log(winEvent)
        let dur = 5
        toast.info(winEvent.message, {})
        const id = toast.info(`Redirecting in ${dur} Seconds`)
        const interval = setInterval(() => {
            dur--
            toast.info(`Redirecting in ${dur} Seconds`, { id: id })
            if (dur === 0) {
                clearInterval(interval)
                toast.dismiss()
                navigate("/")
            }
        }, 1000)
        const gameGrid = document.getElementsByClassName("cells")
        for (let i = 0; i < gameGrid.length; i++) {
            const cell = gameGrid.item(i) as HTMLLIElement
            if (cell) {
                cell.style.cursor = "not-allowed"
            }
        }
    }, [winEvent])
    async function moveListener(event: any) {
        if (winEvent.winner) return
        if (turn) {
            const cell = event.target
            try {
                const res = await socket
                    .timeout(1000)
                    .emitWithAck("move", { move: cell.id })
                if (res.status === 200) {
                    cell.innerText = sign
                    setTurn((turn) => !turn)
                } else {
                    console.log("Invalid Move", res)
                }
            } catch (e: Error | any) {
                if (e.message === "timeout") {
                    console.log("Timeout")
                }
            }
        }
    }
    return (
        <div>
            <GameHeading />
            {!winEvent.winner && (
                <div className="mt-10 flex flex-row items-center justify-between px-8 text-3xl font-semibold md:px-28 md:text-5xl">
                    {/* <h1 className="text-2xl font-bold">GameId: {gameId}</h1> */}
                    <h1 className="text-fuchsia-500">Your Sign: {sign}</h1>
                    <h1>
                        {turn ? (
                            <div className="text-cyan-400">Your Turn</div>
                        ) : (
                            <div className="text-rose-500">Opponents Turn</div>
                        )}
                    </h1>
                </div>
            )}
            {winEvent.winner && (
                <h1>{winEvent.id === socket.id ? "You Won!" : "Game Over!"}</h1>
            )}
            <div className="mt-[10%] flex justify-center">
                <div>
                    <div className="items-centers grid grid-cols-3 justify-center gap-0">
                        {Array(9)
                            .fill(0)
                            .map((_, i) => (
                                <div
                                    className="cells flex h-[68px] w-[68px] cursor-pointer items-center justify-center border-2 border-solid border-primary text-center text-2xl"
                                    key={i}
                                    id={i.toString()}
                                    onClick={moveListener}
                                ></div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
