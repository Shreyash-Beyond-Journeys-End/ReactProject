import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import { useGameContext } from './context/GameContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Library from './pages/Library';
import GameDetails from './pages/GameDetails';
import AddGame from './pages/AddGame';
import Profile from './pages/Profile';



const AppContent = () => {
  const { state } = useGameContext();
  
  return (
    <Router>
      <div className={`min-h-screen ${state.darkMode ? 'dark' : ''}`}>
        <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/library" element={<Library />} />
              <Route path="/game/:id" element={<GameDetails />} />
              <Route path="/add-game" element={<AddGame />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

function App() {
  return (
    
    <GameProvider>
   
      <AppContent />
    </GameProvider>
  );
}

export default App;