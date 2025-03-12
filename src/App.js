import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Game from './pages/Game';
import Tutorial from './pages/Tutorial';
import Login_In from './pages/Login_In';
import Sign_Up from './pages/Sign_Up';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/tutorial" element={<Tutorial />} />
        <Route path="/Login_In" element={<Login_In />} /> {/* Corrected to Login_In */}
        <Route path="/Sign_Up" element={<Sign_Up />} /> {/* Corrected to Sign_Up */}
      </Routes>
    </Router>
  );
}

export default App;