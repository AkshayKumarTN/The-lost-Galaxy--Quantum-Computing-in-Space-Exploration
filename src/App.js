import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Game from "./pages/Game";
import Tutorial from "./pages/Tutorial";
import LoginIn from "./pages/LoginIn";
import SignUp from "./pages/SignUp";
import LeaderBoard from "./pages/LeaderBoard"; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/tutorial" element={<Tutorial />} />
        <Route path="/LoginIn" element={<LoginIn />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/leaderboard" element={<LeaderBoard />} /> {/* 新增排行榜頁面 */}
      </Routes>
    </Router>
  );
}

export default App;
