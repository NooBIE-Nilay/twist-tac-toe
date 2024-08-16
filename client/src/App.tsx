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
    "Player " + Math.floor(Math.random() * 100)
  );
  const [gameJoinedEvents, setGameJoinedEvents] = useState<
    GameJoinedEventType[]
  >([]);
  function gameJoinedHandler(data: GameJoinedEventType) {
    setGameJoinedEvents((prev) => [...prev, data]);
  }
  useEffect(() => {
    socket.on("gameJoined", gameJoinedHandler);
    return () => {
      socket.off("gameJoined", gameJoinedHandler);
    };
  }, [gameJoinedEvents]);
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
            <Route path="/game/:gameId" element={<Game />} />
            <Route path="/colors" element={<Colors />} />
            <Route path="*" element={<div>Not Found</div>} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

export default App;
