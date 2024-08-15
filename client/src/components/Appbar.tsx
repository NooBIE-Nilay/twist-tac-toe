import { ModeToggle } from "@/components/util/mode-toggle";

export function Appbar({ username }: { username: string }) {
  return (
    <>
      <div className="flex justify-end items-center">
        <div className="text-base font-semi">{username}</div>
        <ModeToggle />
      </div>
    </>
  );
}
