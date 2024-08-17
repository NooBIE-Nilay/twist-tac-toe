import { useEffect, useState } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/components/util/themeProvider";
import { Appbar } from "@/components/Appbar";
import { Landing } from "@/components/pages/Landing";
import Colors from "@/components/pages/Colors";
import { Game } from "@/components/pages/Game";
import { Create } from "@/components/pages/Create";
import { Join } from "@/components/pages/Join";
import { socket } from "./socket";
import { GameJoinedEventType } from "../../common/types";

function App() {
  const [username, setUsername] = useState(
    "NooBIE_" + Math.floor(Math.random() * 100)
  );
  const [sign, setSign] = useState("");
  const [turn, setTurn] = useState(false);
  const [gameJoinedEvents, setGameJoinedEvents] = useState<
    GameJoinedEventType[]
  >([]);
  const [moveEvent, setMoveEvent] = useState({
    move: "",
    id: "",
    username: "",
  });
  function gameJoinedHandler(data: GameJoinedEventType) {
    setGameJoinedEvents((prev) => [...prev, data]);
  }
  function initHandler({ id, sign }: { id: string; sign: string }) {
    if (id === socket.id) {
      if (sign === "X") setTurn(true);
      setSign(sign);
    }
  }
  function moveHandler(data: { move: string; id: string; username: string }) {
    console.log(data);
    if (socket.id !== data.id) {
      setMoveEvent(data);
      setTurn((turn) => !turn);
    }
  }
  useEffect(() => {
    socket.on("gameJoined", gameJoinedHandler);
    socket.on("init", initHandler);
    return () => {
      socket.off("gameJoined", gameJoinedHandler);
      socket.off("init", initHandler);
    };
  }, [gameJoinedEvents]);
  useEffect(() => {
    socket.on("move", moveHandler);
    return () => {
      socket.off("move", moveHandler);
    };
  }, [moveEvent]);
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Appbar username={username} />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route
              path="/create"
              element={<Create username={username} events={gameJoinedEvents} />}
            />
            <Route
              path="/join"
              element={<Join username={username} events={gameJoinedEvents} />}
            />
            <Route
              path="/game/:gameId"
              element={
                <Game
                  sign={sign}
                  moveEvent={moveEvent}
                  turnState={[turn, setTurn]}
                />
              }
            />
            <Route path="/colors" element={<Colors />} />
            <Route path="*" element={<div>Not Found</div>} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

export default App;
