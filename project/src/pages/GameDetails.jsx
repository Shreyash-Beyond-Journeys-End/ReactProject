import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getGameDetails, getGameScreenshots } from '../services/api';
import { useGameContext } from '../context/GameContext';
import { 
  FaStar, 
  FaPlaystation, 
  FaXbox, 
  FaWindows, 
  FaLinux, 
  FaApple,
  FaSteam,
  FaExternalLinkAlt, 
  FaGooglePlay,
  FaAppStore,
  FaShoppingCart
} from 'react-icons/fa';
import { 
  SiNintendo, 
  SiEpicgames, 
  SiGogdotcom,
} from 'react-icons/si';

const GameDetails = () => {
  const { id } = useParams();
  const { state, dispatch } = useGameContext();
  const [game, setGame] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [activeTab, setActiveTab] = useState('about');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const stores = [
    {
      id: 1,
      name: 'App Store',
      icon: <FaAppStore className="text-xl" />,
      url: 'apps.apple.com',
      slug: 'apple'
    },
    {
      id: 2,
      name: 'PlayStation Store',
      icon: <FaPlaystation className="text-xl" />,
      url: 'store.playstation.com',
      slug: 'playstation'
    },
    {
      id: 3,
      name: 'Xbox Store',
      icon: <FaXbox className="text-xl" />,
      url: 'xbox.com/games',
      slug: 'xbox'
    },
    {
      id: 4,
      name: 'Steam',
      icon: <FaSteam className="text-xl" />,
      url: 'store.steampowered.com',
      slug: 'steam'
    },
    {
      id: 5,
      name: 'GOG',
      icon: <SiGogdotcom className="text-xl" />,
      url: 'gog.com',
      slug: 'gog'
    },
   
    {
      id: 7,
      name: 'Nintendo Store',
      icon: <SiNintendo className="text-xl" />,
      url: 'nintendo.com/store',
      slug: 'nintendo'
    },
    {
      id: 8,
      name: 'Google Play',
      icon: <FaGooglePlay className="text-xl" />,
      url: 'play.google.com',
      slug: 'google'
    },
    {
      id: 9,
      name: 'Epic Games',
      icon: <SiEpicgames className="text-xl" />,
      url: 'store.epicgames.com',
      slug: 'epic'
    }
  ];

  const getPlatformIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case 'pc': return <FaWindows className="text-xl" />;
      case 'playstation': return <FaPlaystation className="text-xl" />;
      case 'xbox': return <FaXbox className="text-xl" />;
      case 'nintendo': return <SiNintendo className="text-xl" />;
      case 'linux': return <FaLinux className="text-xl" />;
      case 'mac': return <FaApple className="text-xl" />;
      default: return null;
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        setLoading(true);
        const [gameData, screenshotsData] = await Promise.all([
          getGameDetails(id),
          getGameScreenshots(id)
        ]);
        setGame(gameData);
        setScreenshots(screenshotsData.results);
      } catch (err) {
        setError('Failed to fetch game details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGameData();
  }, [id]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (screenshots.length > 0) {
        setCurrentImageIndex((prevIndex) => 
          prevIndex === screenshots.length - 1 ? 0 : prevIndex + 1
        );
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [screenshots]);

  const StoreLinkSection = () => {
    const storeUrls = {
      steam: 'store.steampowered.com',
      gog: 'gog.com',
      epic: 'epicgames.com',
      playstation: 'store.playstation.com',
      xbox: 'xbox.com',
      nintendo: 'nintendo.com'
    };

     return (
    <div className="game-card p-6 space-y-4">
      <h3 className="section-title text-xl font-bold">Available Stores</h3>
      <div className="space-y-3">
        {stores.map((store) => {
          const gameStore = game.stores?.find(s => s.store.slug === store.slug);
          if (!gameStore) return null;

          return (
            <a
              key={store.id}
              href={`https://${store.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full p-3 bg-white dark:bg-gray-700 
                rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300 
                hover:shadow-md group"
            >
              <div className="flex items-center gap-3">
                {store.icon}
                <span className="font-medium">{store.name}</span>
              </div>
              <div className="flex items-center gap-2 text-blue-500 group-hover:text-blue-600">
                <span>Visit Store</span>
                <FaExternalLinkAlt className="text-sm transition-transform group-hover:translate-x-1" />
              </div>
            </a>
          );
        })}
      </div>
      
      {(!game.stores || game.stores.length === 0) && (
        <p className="text-gray-500 dark:text-gray-400 text-center py-4">
          No store links available
        </p>
      )}

      <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
        <div className="flex items-start gap-3">
          <FaShoppingCart className="text-yellow-600 dark:text-yellow-400 mt-1" />
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            Game prices and availability may vary by region and platform. Please check your local store for the most accurate information.
          </p>
        </div>
      </div>
    </div>
  );
};

  const MetaSection = () => (
    <div className="game-card p-6 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="stat-card bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Release Date</h4>
          <p className="text-lg">{new Date(game.released).toLocaleDateString()}</p>
        </div>
        <div className="stat-card bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Rating</h4>
          <div className="flex items-center gap-2">
            <FaStar className="text-yellow-400" />
            <span className="text-lg">{game.rating}/5</span>
          </div>
        </div>
      </div>

      {game.metacritic && (
        <div className="stat-card bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Metacritic Score</h4>
          <div className="flex items-center gap-2">
            <span className={`text-2xl font-bold ${
              game.metacritic >= 75 ? 'text-green-500' :
              game.metacritic >= 50 ? 'text-yellow-500' :
              'text-red-500'
            }`}>
              {game.metacritic}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">/ 100</span>
          </div>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="game-card p-6 text-center">
          <p className="error-message">{error}</p>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="game-card p-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">Game not found</p>
        </div>
      </div>
    );
  }

  const isInCollection = state.collection.some(item => item.id === game.id);

  return (
    <div className="container mx-auto px-4 py-4 animate-fadeIn">
   
    <div className="relative h-[600px] rounded-xl overflow-hidden mb-8 game-card mt-12">
      <img
        src={screenshots[currentImageIndex]?.image || game.background_image}
        alt={game.name}
        className="w-full h-full object-cover transition-transform duration-700 ease-in-out"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent p-8">
        <h1 className="text-4xl font-bold text-white mb-4 animate-float drop-shadow-lg">
          {game.name}
        </h1>
        <div className="flex items-center gap-4 text-white drop-shadow-md">
          <div className="flex items-center gap-2">
            <FaStar className="text-yellow-400" />
            <span className="font-semibold">{game.rating}/5</span>
          </div>
          <span>|</span>
          <span className="font-medium">{new Date(game.released).toLocaleDateString()}</span>
        </div>
      </div>
    </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
       
        <div className="lg:col-span-2 space-y-6">
          
          <div className="flex gap-4 mb-6">
            {['about', 'media', 'dlc'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`tab-button ${
                  activeTab === tab ? 'tab-button-active' : 'tab-button-inactive'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

         
          <div className="game-detail-card">
            {activeTab === 'about' && (
              <div className="space-y-6">
                <div>
                  <h2 className="section-title">About</h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {game.description_raw}
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Features</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {game.tags?.slice(0, 6).map(tag => (
                      <div key={tag.id} className="game-tag">
                        {tag.name}
                      </div>
                    ))}
                  </div>
                </div>

                {game.platforms && (
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Platforms</h3>
                    <div className="flex flex-wrap gap-4">
                      {game.platforms.map(({ platform }) => (
                        <div key={platform.id} className="game-tag flex items-center gap-2">
                          {getPlatformIcon(platform.name)}
                          <span>{platform.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'media' && (
              <div className="space-y-6">
                <h2 className="section-title">Screenshots & Media</h2>
                <div className="grid grid-cols-2 gap-4">
                  {screenshots.map(screenshot => (
                    <div key={screenshot.id} className="relative group hover-card">
                      <img
                        src={screenshot.image}
                        alt="Game Screenshot"
                        className="rounded-lg w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity rounded-lg" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'dlc' && (
              <div>
                <h2 className="section-title">DLC & Editions</h2>
                {game.dlc && game.dlc.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {game.dlc.map(dlc => (
                      <div key={dlc.id} className="game-card p-4">
                        <h3 className="font-semibold mb-2">{dlc.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {dlc.description}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">
                    No DLC or additional content available.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

       
       
<div className="space-y-6">
  <div className="game-card p-6 flex flex-col gap-6">
    
    <button
      onClick={() => {
        if (isInCollection) {
          if (window.confirm('Are you sure you want to remove this game from your collection?')) {
            dispatch({ type: 'REMOVE_FROM_COLLECTION', payload: game.id });
          }
        } else {
          dispatch({ type: 'ADD_TO_COLLECTION', payload: game });
        }
      }}
      className={`w-full py-3 px-4 rounded-lg text-white font-semibold
        transition-all duration-300 transform hover:scale-105 active:scale-95 ${
        isInCollection 
          ? 'bg-red-500 hover:bg-red-600' 
          : 'bg-blue-500 hover:bg-blue-600'
      }`}
    >
      {isInCollection ? 'Remove from Collection' : 'Add to Collection'}
    </button>

  
    <MetaSection />

   
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Available Stores</h3>
      <div className="space-y-3">
        {stores.map((store) => {
          const gameStore = game.stores?.find(s => s.store.slug === store.slug);
          if (!gameStore) return null;

          return (
            <a
              key={store.id}
              href={`https://${store.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full p-3 bg-white dark:bg-gray-700 
                rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300 
                hover:shadow-md group"
            >
              <div className="flex items-center gap-3">
                {store.icon}
                <span className="font-medium">{store.name}</span>
              </div>
              <div className="flex items-center gap-2 text-blue-500 group-hover:text-blue-600">
                <span>Visit Store</span>
                <FaExternalLinkAlt className="text-sm transition-transform group-hover:translate-x-1" />
              </div>
            </a>
          );
        })}
      </div>

      {(!game.stores || game.stores.length === 0) && (
        <p className="text-gray-500 dark:text-gray-400 text-center py-4">
          No store links available
        </p>
      )}

      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
        <div className="flex items-start gap-3">
          <FaShoppingCart className="text-yellow-600 dark:text-yellow-400 mt-1 flex-shrink-0" />
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            Game prices and availability may vary by region and platform. Please check your local store for the most accurate information.
          </p>
        </div>
      </div>
    </div>

    
    {game.website && (
      <a
        href={game.website}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-center py-3 px-4 bg-gray-100 dark:bg-gray-700 
          rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 
          transition-all duration-300 transform hover:scale-105 
          text-gray-900 dark:text-gray-100 font-medium"
      >
        Visit Official Website
      </a>
    )}
  </div>

  
  <div className="game-card p-6 bg-blue-50 dark:bg-blue-900/30">
    <h4 className="font-semibold mb-4">Purchase Protection</h4>
    <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
      <li className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></span>
        Only buy from verified stores
      </li>
      <li className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></span>
        Check regional availability
      </li>
      <li className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></span>
        Verify system requirements
      </li>
      <li className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></span>
        Keep proof of purchase
      </li>
    </ul>
  </div>
</div>
      </div>
    </div>
  );
};

export default GameDetails;