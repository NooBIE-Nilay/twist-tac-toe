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
    type: "",
    move: "",
    id: "",
    username: "",
  });
  const [winEvent, setWinEvent] = useState({ winner: "", id: "", message: "" });
  function resetGame() {
    setWinEvent({ winner: "", id: "", message: "" });
    setMoveEvent({
      type: "",
      move: "",
      id: "",
      username: "",
    });
    setSign("O");
    setTurn(false);
  }
  useEffect(() => resetGame(), []);
  function gameJoinedHandler(data: GameJoinedEventType) {
    resetGame();
    setGameJoinedEvents((prev) => [...prev, data]);
  }
  function initHandler({
    id,
    sign,
    turn,
  }: {
    id: string;
    sign: string;
    turn: boolean;
  }) {
    if (id === socket.id) {
      setTurn(turn);
      setSign(sign);
    }
  }
  function moveHandler(data: { move: string; id: string; username: string }) {
    if (socket.id !== data.id) {
      setMoveEvent({ ...data, type: "move" });
      setTurn((turn) => !turn);
    }
  }
  function removeHandler(data: { move: string; id: string; username: string }) {
    console.log("Remove", data);
    setMoveEvent({ ...data, type: "remove" });
  }
  function winHandler(data: { winner: string; id: string; message: string }) {
    setWinEvent(data);
    console.log(data.message);
    setGameJoinedEvents([]);
  }

  useEffect(() => {
    if (!socket.connected) socket.connect();
  }, [gameJoinedEvents, moveEvent]);
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
    socket.on("remove", removeHandler);
    return () => {
      socket.off("move", moveHandler);
      socket.off("remove", removeHandler);
    };
  }, [moveEvent]);
  useEffect(() => {
    socket.on("win", winHandler);

    return () => {
      socket.off("win", winHandler);
    };
  }, [winEvent]);
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Appbar username={username} />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route
              path="/create"
              element={
                <Create
                  username={username}
                  events={gameJoinedEvents}
                  randomGame={false}
                />
              }
            />
            <Route
              path="/create_random"
              element={
                <Create
                  username={username}
                  events={gameJoinedEvents}
                  randomGame
                />
              }
            />
            <Route
              path="/join"
              element={<Join username={username} events={gameJoinedEvents} />}
            />
            <Route
              path="/join/:joinId"
              element={<Join username={username} events={gameJoinedEvents} />}
            />
            <Route
              path="/game/:gameId"
              element={
                <Game
                  sign={sign}
                  moveEvent={moveEvent}
                  turnState={[turn, setTurn]}
                  winEvent={winEvent}
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
