export function Loading() {
  return (
    <div className="flex items-center justify-center  p-5 ">
      <div className="flex space-x-2 animate-pulse">
        <div className="w-3 h-3 bg-secondary-foreground rounded-full"></div>
        <div className="w-3 h-3 bg-secondary-foreground rounded-full"></div>
        <div className="w-3 h-3 bg-secondary-foreground rounded-full"></div>
      </div>
    </div>
  );
}
