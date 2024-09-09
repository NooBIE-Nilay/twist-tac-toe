import { ModeToggle } from "@/components/util/mode-toggle"

export function Appbar({ username }: { username: string }) {
    return (
        <>
            <div className="flex items-center justify-end">
                <div className="font-semi text-base">{username}</div>
                <ModeToggle />
            </div>
        </>
    )
}
