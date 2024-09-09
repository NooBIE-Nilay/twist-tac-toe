import WordRotate from "@/components/magicui/word-rotate"

export function GameHeading() {
    return (
        <>
            <div className="grid grid-flow-col items-center justify-center text-6xl font-bold md:text-8xl">
                <div className="min-w-[148px] md:min-w-[244px]">
                    <WordRotate
                        className="text-end text-black dark:text-white"
                        words={["Tic", "Twist"]}
                        duration={2000}
                    />
                </div>
                <span className="ml-6"> Tac Toe</span>
            </div>
        </>
    )
}
