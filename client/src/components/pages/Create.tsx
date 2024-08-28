import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../../socket";
import { MagicCard } from "@/components/magicui/magic-card";
import { useTheme } from "@/components/util/themeProvider";
import { Loading } from "@/components/ui/loading";
import { GameHeading } from "@/components/GameHeading";
import { CopyButton } from "@/components/CopyButton";
import { GameJoinedEventType } from "../../../../common/types";

export function Create({
  username,
  events,
  randomGame = false,
}: {
  username: string;
  events: GameJoinedEventType[];
  randomGame: boolean;
}) {
  const navigate = useNavigate();
  const [gameId, setGameId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [copyStatus, setCopyStatus] = useState("Copy");
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (randomGame) {
      socket.emit("joinRandomGame", { username });
      return;
    }
    socket.emit("createGame", { username });
  }, []);
  useEffect(() => {
    events.forEach((event) => {
      if (event.id === socket.id) {
        setIsLoading(false);
        setGameId(event.gameId);
        setMessage(event.message);
        if (event.playersJoined >= 2) navigate(`/game/${event.gameId}`);
      } else if (event.gameId === gameId && event.playersJoined >= 2) {
        console.log(
          event.username,
          " Joined the game!\nRedirecting to game page..."
        );
        navigate(`/game/${gameId}`);
      }
    });
  }, [events]);
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
            <div className="flex justify-center items-center mt-3">
              <span className="text-xl ">{message}</span>
            </div>
          </MagicCard>
        </div>
      </div>
    </div>
  );
}
