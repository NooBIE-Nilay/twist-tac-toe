import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { socket } from "@/socket";
import { GameHeading } from "@/components/GameHeading";
import { InputCodePattern } from "@/components/InputCodePattern";
import { MagicCard } from "../magicui/magic-card";
import { useTheme } from "../util/themeProvider";
import { Loading } from "../ui/loading";
import { Button } from "../ui/button";
import { GameJoinedEventType } from "../../../../common/types";

export function Join({
  username,
  events,
}: {
  username: string;
  events: GameJoinedEventType[];
}) {
  const [gameId, setGameId] = useState(useParams().joinId || "");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    events.forEach((event) => {
      console.log(event);
      if (event.id === socket.id && gameId === event.gameId) {
        setIsLoading(false);
        navigate(`/game/${event.gameId}`);
      }
    });
  }, [events]);
  function joinGame() {
    if (!socket.connected) socket.connect();
    if (!gameId) return;
    setIsLoading(true);
    socket.emit("joinGame", { username, gameId });
    return () => {
      socket.disconnect();
    };
  }
  return (
    <div>
      <GameHeading />
      <div className="flex justify-center  ">
        <div>
          <MagicCard
            className="cursor-pointer flex-col items-center justify-center shadow-2xl whitespace-nowrap top-[50%] text-2xl  w-[460px] h-[280px]"
            gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
          >
            <div className="flex flex-col gap-6  text-wrap justify-center ">
              <span className="capitalize text-4xl">Enter Game Code:</span>
              <div className="inline-flex gap-5">
                <InputCodePattern setCode={setGameId} value={gameId} />
                <Button variant="outline" onClick={joinGame}>
                  Join Game
                </Button>
              </div>
              {isLoading && <Loading />}
            </div>
          </MagicCard>
        </div>
      </div>
    </div>
  );
}
