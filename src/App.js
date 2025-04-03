import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Game from './pages/Game';
import Tutorial from './pages/Tutorial';
import LoginIn from './pages/LoginIn';
import SignUp from './pages/SignUp';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/tutorial" element={<Tutorial />} />
        <Route path="/LoginIn" element={<LoginIn />} /> {/* Corrected to Login_In */}
        <Route path="/SignUp" element={<SignUp />} /> {/* Corrected to Sign_Up */}
      </Routes>
    </Router>
  );
}

export default App;