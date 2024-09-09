export function CopyButton({
    copyState,
    gameId,
}: {
    copyState: [copyStatus: string, setCopyStatus: (status: string) => void]
    gameId: string
}) {
    const [copyStatus, setCopyStatus] = copyState
    return (
        <div>
            <button
                className="inline-flex items-center gap-x-2 rounded-lg border border-gray-200 bg-primary-foreground p-3 text-sm font-semibold text-primary shadow-sm hover:bg-primary-foreground/50 focus:bg-primary-foreground/50 focus:outline-none"
                onClick={async () => {
                    try {
                        await window.navigator.clipboard.writeText(gameId)
                        setCopyStatus("Copied!")
                        setTimeout(() => {
                            setCopyStatus("Copy")
                        }, 3000)
                    } catch (err) {
                        console.error("Unable to copy to clipboard.", err)
                        setCopyStatus("Error")
                    }
                }}
            >
                {copyStatus === "Copy" && (
                    <svg
                        className="size-4 transition ease-in-out hover:rotate-12"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <rect
                            width="8"
                            height="4"
                            x="8"
                            y="2"
                            rx="1"
                            ry="1"
                        ></rect>
                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                    </svg>
                )}
                {copyStatus === "Copied!" && (
                    <svg
                        className="size-4 text-blue-600 transition ease-in-out hover:-rotate-12"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                )}
                {copyStatus === "Error" && (
                    <svg
                        className="size-5 transition ease-in-out hover:-rotate-12"
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        width="24"
                        height="24"
                        viewBox="0 0 48 48"
                    >
                        <path
                            fill="#f44336"
                            d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"
                        ></path>
                        <path
                            fill="#fff"
                            d="M29.656,15.516l2.828,2.828l-14.14,14.14l-2.828-2.828L29.656,15.516z"
                        ></path>
                        <path
                            fill="#fff"
                            d="M32.484,29.656l-2.828,2.828l-14.14-14.14l2.828-2.828L32.484,29.656z"
                        ></path>
                    </svg>
                )}
                <div className=" ">{copyStatus}</div>
            </button>
        </div>
    )
}
