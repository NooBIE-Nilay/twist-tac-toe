import confetti from "canvas-confetti"

export const ConfettiEmojiHandler = (emojis: string[]) => {
    const scalar = 2
    const shapes: confetti.Shape[] = []
    emojis.forEach((emoji) => {
        shapes.push(confetti.shapeFromText({ text: emoji, scalar }))
    })

    const defaults = {
        spread: 360,
        ticks: 200,
        gravity: 1,
        decay: 0.96,
        startVelocity: 20,
        shapes: shapes,
        scalar,
    }

    const shoot = () => {
        confetti({
            ...defaults,
            particleCount: 50,
        })

        confetti({
            ...defaults,
            particleCount: 10,
        })

        confetti({
            ...defaults,
            particleCount: 25,
            scalar: scalar / 2,
            shapes: ["circle"],
        })
    }

    setTimeout(shoot, 0)
    setTimeout(shoot, 100)
    setTimeout(shoot, 200)
}
