import { Link } from 'react-router-dom';
import { useGameContext } from '../context/GameContext';
import { useState } from 'react';
import { 
  FaPlaystation, 
  FaXbox, 
  FaWindows, 
  FaLinux, 
  FaApple, 
  FaSpinner 
} from 'react-icons/fa';
import { SiNintendoswitch } from 'react-icons/si';

const GameCard = ({ game }) => {
  const { state, dispatch } = useGameContext();
  const isInCollection = state.collection.some(item => item.id === game.id);
  const [showWarning, setShowWarning] = useState(false);
  const [showCollectionDialog, setShowCollectionDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const getPlatformIcon = (platformName) => {
    const platformIcons = {
      'PlayStation 5': <FaPlaystation className="text-[#006FCD]" />,
      'PlayStation 4': <FaPlaystation className="text-[#006FCD]" />,
      'PlayStation 3': <FaPlaystation className="text-[#006FCD]" />,
      'Xbox Series S/X': <FaXbox className="text-[#107C10]" />,
      'Xbox One': <FaXbox className="text-[#107C10]" />,
      'Xbox 360': <FaXbox className="text-[#107C10]" />,
      'PC': <FaWindows className="text-[#00A4EF]" />,
      'Nintendo Switch': <SiNintendoswitch className="text-[#E60012]" />,
      'Linux': <FaLinux className="text-gray-700 dark:text-gray-300" />,
      'iOS': <FaApple className="text-gray-700 dark:text-gray-300" />,
      'macOS': <FaApple className="text-gray-700 dark:text-gray-300" />
    };
    return platformIcons[platformName] || null;
  };

  const handleCollectionToggle = () => {
    if (isInCollection) {
      setShowWarning(true);
    } else {
      setShowCollectionDialog(true);
    }
  };

  const handleAddToCollection = async (status) => {
    setIsLoading(true);
    try {
      dispatch({
        type: 'ADD_TO_COLLECTION',
        payload: { ...game, status }
      });
    } finally {
      setIsLoading(false);
      setShowCollectionDialog(false);
    }
  };

  const handleRemoveConfirmation = (confirmed) => {
    if (confirmed) {
      setIsLoading(true);
      try {
        dispatch({ type: 'REMOVE_FROM_COLLECTION', payload: game.id });
      } finally {
        setIsLoading(false);
      }
    }
    setShowWarning(false);
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 
      rounded-lg shadow-lg overflow-hidden relative transform transition-all duration-300 
      hover:scale-[1.02] hover:shadow-2xl border border-gray-100 dark:border-gray-700
      backdrop-filter backdrop-blur-sm">
      {isInCollection && (
        <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold 
          text-white shadow-lg z-10 backdrop-filter backdrop-blur-sm ${
            game.status === 'Playing' 
              ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500' :
            game.status === 'Completed' 
              ? 'bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500' : 
            'bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500'
          }`}>
          {game.status}
        </div>
      )}

      <div className="relative group">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 
            dark:from-gray-700 dark:to-gray-800 animate-pulse h-48" />
        )}
        <img
          src={game.background_image}
          alt={game.name}
          className="w-full h-48 object-cover transform transition-all duration-500 
            group-hover:scale-110 filter brightness-95 group-hover:brightness-110"
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent 
          opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-6 space-y-4">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white tracking-tight">
          {game.name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Release Date: {new Date(game.released).toLocaleDateString()}
        </p>

        <div className="flex justify-between items-center gap-4">
          <Link
            to={`/game/${game.id}`}
            className="flex-1 px-4 py-2 rounded-lg text-center font-semibold
              bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800
              text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600
              hover:shadow-md hover:from-gray-100 hover:to-gray-200 
              dark:hover:from-gray-600 dark:hover:to-gray-700
              transition-all duration-200"
          >
            View Details
          </Link>
          <button
            onClick={handleCollectionToggle}
            disabled={isLoading}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold text-white shadow-md
              transition-all duration-200 ${
                isInCollection
                  ? 'bg-gradient-to-r from-rose-500 via-red-500 to-pink-500 hover:from-rose-600 hover:via-red-600 hover:to-pink-600'
                  : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600'
              } disabled:opacity-50 hover:shadow-lg transform hover:-translate-y-0.5`}
          >
            {isLoading ? (
              <FaSpinner className="animate-spin inline" />
            ) : (
              isInCollection ? 'Remove' : 'Add to Collection'
            )}
          </button>
        </div>
      </div>

            {/* Collection Selection Dialog */}
            {showCollectionDialog && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" 
            onClick={() => setShowCollectionDialog(false)} />
          <div className="relative bg-gradient-to-br from-white to-gray-50 
            dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-2xl p-6 max-w-md w-full
            border border-gray-100 dark:border-gray-700 animate-float">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Add to Collection
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Choose where to add "{game.name}":
            </p>
            <div className="space-y-3">
              <button
                onClick={() => handleAddToCollection('Playing')}
                className="w-full px-4 py-3 rounded-lg font-semibold text-white shadow-md
                  bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
                  hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600
                  transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5
                  disabled:opacity-50"
                disabled={isLoading}
              >
                Currently Playing
              </button>
              <button
                onClick={() => handleAddToCollection('Completed')}
                className="w-full px-4 py-3 rounded-lg font-semibold text-white shadow-md
                  bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500
                  hover:from-emerald-600 hover:via-green-600 hover:to-teal-600
                  transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5
                  disabled:opacity-50"
                disabled={isLoading}
              >
                Completed
              </button>
              <button
                onClick={() => handleAddToCollection('Backlog')}
                className="w-full px-4 py-3 rounded-lg font-semibold text-white shadow-md
                  bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500
                  hover:from-amber-600 hover:via-yellow-600 hover:to-orange-600
                  transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5
                  disabled:opacity-50"
                disabled={isLoading}
              >
                Backlog
              </button>
              <button
                onClick={() => setShowCollectionDialog(false)}
                className="w-full px-4 py-3 rounded-lg font-semibold
                  bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800
                  text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600
                  hover:shadow-md hover:from-gray-100 hover:to-gray-200 
                  dark:hover:from-gray-600 dark:hover:to-gray-700
                  transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}


      {showWarning && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" 
            onClick={() => handleRemoveConfirmation(false)} />
          <div className="relative bg-gradient-to-br from-white to-gray-50 
            dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-2xl p-6 max-w-md w-full
            border border-gray-100 dark:border-gray-700 animate-float">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Remove Game
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to remove "{game.name}" from your collection?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => handleRemoveConfirmation(false)}
                className="px-6 py-2 rounded-lg font-semibold
                  bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800
                  text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600
                  hover:shadow-md hover:from-gray-100 hover:to-gray-200 
                  dark:hover:from-gray-600 dark:hover:to-gray-700
                  transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRemoveConfirmation(true)}
                className="px-6 py-2 rounded-lg font-semibold text-white shadow-md
                  bg-gradient-to-r from-rose-500 via-red-500 to-pink-500 
                  hover:from-rose-600 hover:via-red-600 hover:to-pink-600
                  transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5
                  disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? (
                  <FaSpinner className="animate-spin inline" />
                ) : (
                  'Remove'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameCard;