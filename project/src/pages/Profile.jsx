import { useState, useRef, useEffect } from 'react';
import { useGameContext } from '../context/GameContext';
import { 
  FaGamepad, 
  FaCheck, 
  FaClock, 
  FaTrophy, 
  FaEdit, 
  FaCamera, 
  FaStar, 
  FaUserCircle,
  FaCalendar,
  FaChartLine
} from 'react-icons/fa';

const Profile = () => {
  const { state } = useGameContext();
  const [username, setUsername] = useState(localStorage.getItem('username') || 'Game Enthusiast');
  const [isEditing, setIsEditing] = useState(false);
  const [tempUsername, setTempUsername] = useState(username);
  const [profilePic, setProfilePic] = useState(localStorage.getItem('profilePic') || '');
  const fileInputRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const statsRef = useRef(null);

  const collectionStats = {
    total: state.collection.length,
    playing: state.collection.filter(game => game.status === 'Playing').length,
    completed: state.collection.filter(game => game.status === 'Completed').length,
    backlog: state.collection.filter(game => game.status === 'Backlog').length
  };

  const achievementRate = state.collection.length > 0 
    ? ((collectionStats.completed / state.collection.length) * 100).toFixed(1) 
    : 0;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, []);

  const handleSaveUsername = () => {
    setUsername(tempUsername);
    localStorage.setItem('username', tempUsername);
    setIsEditing(false);
  };

  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
        localStorage.setItem('profilePic', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const StatCard = ({ title, value, icon: Icon, color, bgColor, delay = 0 }) => (
    <div 
      className={`transform transition-all duration-500 hover:scale-105 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className={`
        relative overflow-hidden rounded-2xl p-6
        border border-gray-200/50 dark:border-gray-700/50
        hover:shadow-2xl transition-all duration-300
        ${bgColor}
      `}>
        <div className="absolute inset-0 bg-gradient-to-br opacity-10"
          style={{ 
            background: `linear-gradient(45deg, ${color}, transparent)`,
            backgroundSize: '200% 200%'
          }}
        />
        
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 
              uppercase tracking-wider">{title}</p>
            <p className="text-3xl font-bold mt-2 bg-clip-text text-transparent 
              bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300">
              {value}
            </p>
          </div>
          <div className={`p-3 rounded-full ${bgColor}`}>
            <Icon className={`text-3xl ${color}`} />
          </div>
        </div>
      </div>
    </div>
  );

  const ActivityCard = ({ game, index }) => (
    <div
      className="relative overflow-hidden rounded-xl p-4 transition-all duration-300
        hover:shadow-lg hover:scale-[1.02] bg-white dark:bg-gray-800
        border border-gray-200/50 dark:border-gray-700/50 group"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="relative flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-lg overflow-hidden shadow-lg">
          <img
            src={game.background_image}
            alt={game.name}
            className="w-full h-full object-cover transform transition-transform 
              duration-300 group-hover:scale-110"
          />
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 
            group-hover:text-blue-500 transition-colors duration-300">
            {game.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${
              game.status === 'Playing' ? 'bg-green-500' :
              game.status === 'Completed' ? 'bg-purple-500' :
              'bg-yellow-500'
            }`} />
            <p className={`text-sm font-medium ${
              game.status === 'Playing' ? 'text-green-500' :
              game.status === 'Completed' ? 'text-purple-500' :
              'text-yellow-500'
            }`}>
              {game.status}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl 
          border border-gray-200/50 dark:border-gray-700/50 p-8 
          transform hover:scale-[1.01] transition-transform duration-300">
          <div className="flex flex-col md:flex-row items-center gap-8">
            
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br 
                from-blue-500 to-purple-500 p-1 transform transition-all duration-300 
                group-hover:scale-105">
                <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-800">
                  {profilePic ? (
                    <img 
                      src={profilePic} 
                      alt="Profile" 
                      className="w-full h-full object-cover transition-transform duration-300 
                        group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center 
                      bg-gray-100 dark:bg-gray-700">
                      <FaUserCircle className="w-20 h-20 text-gray-400 dark:text-gray-500" />
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={triggerFileInput}
                className="absolute bottom-0 right-0 bg-gradient-to-r from-blue-500 to-purple-500 
                  p-3 rounded-full text-white shadow-lg transform transition-all duration-300 
                  hover:scale-110 hover:shadow-xl"
              >
                <FaCamera className="text-lg" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleProfilePicChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                {isEditing ? (
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={tempUsername}
                      onChange={(e) => setTempUsername(e.target.value)}
                      className="text-2xl font-bold bg-gray-100 dark:bg-gray-700 rounded-xl 
                        px-4 py-2 focus:ring-2 focus:ring-blue-500/20 outline-none 
                        border-2 border-gray-200 dark:border-gray-600"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveUsername}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 
                          text-white px-4 py-2 rounded-xl hover:shadow-lg 
                          transition-all duration-300"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setTempUsername(username);
                        }}
                        className="bg-gradient-to-r from-gray-500 to-gray-600 
                          text-white px-4 py-2 rounded-xl hover:shadow-lg 
                          transition-all duration-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent 
                      bg-gradient-to-r from-blue-600 to-purple-600">
                      {username}
                    </h1>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 
                        transition-colors duration-200"
                    >
                      <FaEdit className="text-xl text-gray-500 hover:text-gray-700 
                        dark:text-gray-400 dark:hover:text-gray-300" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <FaCalendar className="text-blue-500" />
                  <span>Member since {new Date().getFullYear()}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <FaTrophy className="text-yellow-500" />
                  <span>{achievementRate}% completion rate</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <FaChartLine className="text-green-500" />
                  <span>{collectionStats.total} games collected</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        
        <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Games"
            value={collectionStats.total}
            icon={FaGamepad}
            color="text-blue-500"
            bgColor="bg-white dark:bg-gray-800"
            delay={0}
          />
          <StatCard
            title="Currently Playing"
            value={collectionStats.playing}
            icon={FaGamepad}
            color="text-green-500"
            bgColor="bg-white dark:bg-gray-800"
            delay={100}
          />
          <StatCard
            title="Completed"
            value={collectionStats.completed}
            icon={FaCheck}
            color="text-purple-500"
            bgColor="bg-white dark:bg-gray-800"
            delay={200}
          />
          <StatCard
            title="Backlog"
            value={collectionStats.backlog}
            icon={FaClock}
            color="text-yellow-500"
            bgColor="bg-white dark:bg-gray-800"
            delay={300}
          />
        </div>

       
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl 
          border border-gray-200/50 dark:border-gray-700/50 p-8">
          <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent 
            bg-gradient-to-r from-blue-600 to-purple-600">
            Recent Activity
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {state.collection.slice(0, 6).map((game, index) => (
              <ActivityCard key={game.id} game={game} index={index} />
            ))}
          </div>
        </div>

        
        {state.collection.length === 0 && (
          <div className="text-center bg-white dark:bg-gray-800 rounded-3xl p-12 
            shadow-xl border border-gray-200/50 dark:border-gray-700/50">
            <FaGamepad className="text-6xl mx-auto mb-4 text-gray-400 
              dark:text-gray-500 animate-bounce" />
            <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
              Your Collection is Empty
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Start building your gaming legacy by adding some games to your collection!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;