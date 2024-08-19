import { socket } from "@/socket";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

export function Game({
  sign,
  moveEvent,
  turnState,
}: {
  sign: string;
  moveEvent: { move: string; id: string; username: string; type: string };
  turnState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}) {
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
  async function moveListener(event: any) {
    console.log(turn);
    if (turn) {
      const cell = event.target;
      console.log(cell);
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
      Game: {gameId}
      <h1>Your Sign: {sign}</h1>
      <h1>Turn: {turn ? "Your Turn" : "Opponent's Turn"}</h1>
      <div className="flex justify-center mt-[10%]">
        <div>
          <div className="grid grid-cols-3 w-[144px]  justify-center items-centers">
            {Array(9)
              .fill(0)
              .map((_, i) => (
                <div
                  className="w-[48px] h-[49px] border-solid border-white border-2  my-[1px]  flex text-center  items-center justify-center cursor-pointer"
                  key={i}
                  id={i.toString()}
                  onClick={moveListener}
                >
                  {i}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
