import { socket } from "@/socket";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export function Game({
  sign,
  moveEvent,
  turnState,
  winEvent,
}: {
  sign: string;
  moveEvent: { move: string; id: string; username: string; type: string };
  turnState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  winEvent: { winner: string; id: string; message: string };
}) {
  useEffect(() => {
    if ((sign = "")) {
    }
  }, []);
  const navigate = useNavigate();
  const { gameId } = useParams();
  const [turn, setTurn] = turnState;
  useEffect(() => {
    const cell = document.getElementById(moveEvent.move) || { innerText: "" };
    if (moveEvent.type === "move") {
      cell.innerText = sign === "X" ? "O" : "X";
    } else if (moveEvent.type === "remove") {
      cell.innerText = "";
    }
  }, [moveEvent]);
  useEffect(() => {
    if (!winEvent.winner || winEvent.winner === "") return;
    console.log(winEvent);
    let dur = 5;
    toast.info(winEvent.message, {});
    const id = toast.info(`Redirecting in ${dur} Seconds`);
    const interval = setInterval(() => {
      dur--;
      toast.info(`Redirecting in ${dur} Seconds`, { id: id });
      if (dur === 0) {
        clearInterval(interval);
        toast.dismiss();
        navigate("/");
      }
    }, 1000);
    const gameGrid = document.getElementsByClassName("cells");
    for (let i = 0; i < gameGrid.length; i++) {
      const cell = gameGrid.item(i) as HTMLLIElement;
      if (cell) {
        cell.style.cursor = "not-allowed";
      }
    }
  }, [winEvent]);
  async function moveListener(event: any) {
    if (winEvent.winner) return;
    if (turn) {
      const cell = event.target;
      try {
        const res = await socket
          .timeout(1000)
          .emitWithAck("move", { move: cell.id });
        if (res.status === 200) {
          cell.innerText = sign;
          setTurn((turn) => !turn);
        } else {
          console.log("Invalid Move", res);
        }
      } catch (e: Error | any) {
        if (e.message === "timeout") {
          console.log("Timeout");
        }
      }
    }
  }
  return (
    <div>
      {!winEvent.winner && (
        <div className="flex flex-col justify-center items-center">
          <h1 className="font-bold text-2xl">GameId: {gameId}</h1>
          <h1 className="font-semibold text-2xl">Your Sign: {sign}</h1>
          <h1 className="font-semibold text-2xl">
            {turn ? "Your Turn" : "Opponent's Turn"}
          </h1>
        </div>
      )}
      {winEvent.winner && (
        <h1>{winEvent.id === socket.id ? "You Won!" : "Game Over!"}</h1>
      )}
      <div className="flex justify-center mt-[10%] ">
        <div>
          <div className="grid grid-cols-3 justify-center items-centers gap-0">
            {Array(9)
              .fill(0)
              .map((_, i) => (
                <div
                  className="cells w-[68px] h-[68px] border-solid border-primary border-2    flex text-center  items-center justify-center cursor-pointer text-2xl "
                  key={i}
                  id={i.toString()}
                  onClick={moveListener}
                ></div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
