import { socket } from "@/socket";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export function Game({
  sign,
  moveEvent,
  turnState,
}: {
  sign: string;
  moveEvent: { move: string; id: string; username: string };
  turnState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}) {
  const { gameId } = useParams();
  const [turn, setTurn] = turnState;
  useEffect(() => {
    const cell = document.getElementById(moveEvent.move) || { innerText: "" };
    cell.innerText = sign;
    // setTurn((turn) => (turn === "X" ? "O" : "X"));
  }, [moveEvent]);
  async function moveListener(event: any) {
    console.log(turn);
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
      Game: {gameId}
      <h1>Your Sign: {sign}</h1>
      <h1>Turn: {turn ? "Your Turn" : "Opponent's Turn"}</h1>
      <div>
        <div className="grid grid-cols-3 max-w-[150px] bg-primary justify-center items-centers">
          {Array(9)
            .fill(0)
            .map((_, i) => (
              <div
                className="w-[48px] h-[48px]  bg-primary-foreground my-[1px]  flex text-center  items-center justify-center cursor-pointer"
                key={i}
                onClick={moveListener}
              >
                {i}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
