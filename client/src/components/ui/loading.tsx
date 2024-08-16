export function Loading() {
  return (
    <div className="flex items-center justify-center  p-5 ">
      <div className="flex space-x-2 ">
        <div className="w-3 h-3 bg-secondary-foreground rounded-full animate-pulse"></div>
        <div className="w-3 h-3 bg-secondary-foreground rounded-full animate-pulse delay-100"></div>
        <div className="w-3 h-3 bg-secondary-foreground rounded-full animate-pulse delay-200"></div>
      </div>
    </div>
  );
}
