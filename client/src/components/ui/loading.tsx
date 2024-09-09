export function Loading() {
    return (
        <div className="flex items-center justify-center p-5">
            <div className="flex space-x-2">
                <div className="h-3 w-3 animate-pulse rounded-full bg-secondary-foreground"></div>
                <div className="h-3 w-3 animate-pulse rounded-full bg-secondary-foreground delay-100"></div>
                <div className="h-3 w-3 animate-pulse rounded-full bg-secondary-foreground delay-200"></div>
            </div>
        </div>
    )
}
