import { useEffect, useState } from "react"

export function Timer(props: { timeEvent: any }) {
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
        }, 1000)
        return () => clearInterval(timer)
    }, [])
    return <>{timeLeft !== 0 && <div className="text-3xl">{timeLeft}</div>}</>
}
