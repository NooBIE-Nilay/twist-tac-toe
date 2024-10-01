import { ConfettiEmojiHandler } from "../util/confetti-emoji-handler"

export default function Colors() {
    return (
        <div className="rado grid grid-cols-2 grid-rows-2">
            <div className="h-[100px] w-[100%] rounded bg-primary text-primary-foreground">
                Primary
            </div>
            <div className="rado h-[100px] w-[100%] bg-primary-foreground text-primary">
                Primary Foreground
            </div>
            <div className="rado h-[100px] w-[100%] bg-secondary text-secondary-foreground">
                Secondary
            </div>
            <div className="rado h-[100px] w-[100%] bg-secondary-foreground text-secondary">
                Secondary Forground
            </div>
            <div className="rado h-[100px] w-[100%] bg-card text-card-foreground">
                Card
            </div>
            <div className="rado h-[100px] w-[100%] bg-card-foreground text-card">
                Card-Foreground
            </div>
            <div className="rado h-[100px] w-[100%] bg-accent text-accent-foreground">
                Accent
            </div>
            <div className="rado h-[100px] w-[100%] bg-accent-foreground text-accent">
                Accent-foreground
            </div>
            <div className="rado h-[100px] w-[100%] bg-destructive text-destructive-foreground">
                Destructive
            </div>
            <div className="rado h-[100px] w-[100%] bg-destructive-foreground text-destructive">
                Destructive Forground
            </div>
            <div className="rado h-[100px] w-[100%] bg-popover text-popover-foreground">
                Popover
            </div>
            <div className="rado h-[100px] w-[100%] bg-popover-foreground text-popover">
                Popover Forground
            </div>
            <div className="rado h-[100px] w-[100%] bg-muted text-muted-foreground">
                Muted
            </div>
            <div className="rado h-[100px] w-[100%] bg-muted-foreground text-muted">
                Muted-Foreground
            </div>
            <div className="rado h-[100px] w-[100%] bg-border">Border</div>
            <div className="rado h-[100px] w-[100%] bg-input">Input</div>
            <div className="h-[100px] w-[100%] bg-ring text-white">Ring</div>
            <button
                onClick={() => ConfettiEmojiHandler(["💩", "🧻", "🚽", "🤮"])}
            >
                Test
            </button>
        </div>
    )
}
