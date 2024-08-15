import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MagicCard } from "@/components/magicui/magic-card";
import { useTheme } from "@/components/util/themeProvider";
import { Loading } from "@/components/ui/loading";
import { GameHeading } from "@/components/GameHeading";
import { socket } from "../../socket";
import { CopyButton } from "../CopyButton";

export function Create({ username }: { username: string }) {
  const navigate = useNavigate();
  const [gameId, setGameId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [copyStatus, setCopyStatus] = useState("Copy");
  useEffect(() => {
    function handleGameJoined(data: { username: string; gameId: string }) {
      if (data.username === username) {
        setIsLoading(false);
        setGameId(data.gameId);
        return;
      } else if (data.gameId === gameId) {
        navigate(`/game/${data.gameId}`);
        return;
      }
    }
    if (!socket.connected) socket.connect();
    socket.emit("createGame", { username });
    socket.on("gameJoined", handleGameJoined);
    return () => {
      socket.off("gameJoined", handleGameJoined);
      socket.disconnect();
    };
  }, []);
  const { theme } = useTheme();

  return (
    <div>
      <GameHeading />
      <div className="flex justify-center">
        <div>
          <MagicCard
            className="cursor-pointer flex-col items-center justify-center shadow-2xl whitespace-nowrap top-[50%] text-2xl  w-[460px] h-[280px]"
            gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
          >
            <div className="flex flex-col gap-6 max-w-[350px] text-wrap">
              <span className="capitalize ">
                Share this code with your friend:
              </span>
              <div className="flex justify-center  items-center w-[350px] h-[80px] rounded-md bg-secondary hover:">
                {isLoading ? (
                  <Loading />
                ) : (
                  <div className="inline-flex items-center gap-x-3 tracking-widest uppercase text-3xl">
                    {" " + gameId}
                    <CopyButton
                      copyState={[copyStatus, setCopyStatus]}
                      gameId={gameId}
                    />
                  </div>
                )}
              </div>
            </div>
          </MagicCard>
        </div>
      </div>
    </div>
  );
}
