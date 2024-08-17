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
  function moveListener(event: any) {
    console.log(turn);
    console.log(sign);
    if (turn) {
      const cell = event.target;
      cell.innerText = sign;
      setTurn((turn) => !turn);
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
