import { useParams } from "react-router-dom";

export function Game() {
  const { gameId } = useParams();
  return <div>Game</div>;
}
