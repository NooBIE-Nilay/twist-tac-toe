import { useEffect, useState } from "react"
import AnimatedCircularProgressBar from "./ui/animated-circular-progress-bar"

export function Timer(props: { timeEvent: any; turn: boolean }) {
    const [timeLeft, setTimeLeft] = useState(
        15 - Math.round(props.timeEvent.lastMoveTimeInSeconds),
    )
    if (timeLeft < 0) setTimeLeft(0)
    if (timeLeft > 15) setTimeLeft(15)
    useEffect(() => {
        setTimeLeft(15 - Math.round(props.timeEvent.lastMoveTimeInSeconds))
    }, [props.timeEvent])
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((timeLeft) => timeLeft - 1)
        }, 950)
        return () => clearInterval(timer)
    }, [])
    return (
        <>
            <AnimatedCircularProgressBar
                className="mt-10 h-32 w-32 md:h-40 md:w-40"
                max={15}
                min={0}
                value={timeLeft}
                gaugePrimaryColor={
                    timeLeft <= 10
                        ? timeLeft <= 5
                            ? props.turn
                                ? "#ef4444ff"
                                : "#ef44449f"
                            : props.turn
                              ? "#fbbf24ff"
                              : "#fbbf249f"
                        : props.turn
                          ? "#16a34aff"
                          : "#16a34a9f"
                }
                gaugeSecondaryColor="rgba(0, 0, 0, 0)"
            />
        </>
    )
}
