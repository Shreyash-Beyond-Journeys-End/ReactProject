import { createContext, useContext, useReducer, useEffect } from 'react';

const GameContext = createContext();

const loadInitialState = () => {
  try {
    const savedCollection = localStorage.getItem('gameCollection');
    const savedDarkMode = localStorage.getItem('darkMode');
    
    return {
      collection: savedCollection ? JSON.parse(savedCollection) : [],
      darkMode: savedDarkMode ? JSON.parse(savedDarkMode) : window.matchMedia('(prefers-color-scheme: dark)').matches
    };
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
    return { collection: [], darkMode: false };
  }
};

const gameReducer = (state, action) => {
  let newState;

  switch (action.type) {
    case 'ADD_TO_COLLECTION':
      newState = {
        ...state,
        collection: [...state.collection, action.payload]
      };
      break;

    case 'REMOVE_FROM_COLLECTION':
      newState = {
        ...state,
        collection: state.collection.filter(game => game.id !== action.payload)
      };
      break;

    case 'UPDATE_GAME_STATUS':
      newState = {
        ...state,
        collection: state.collection.map(game =>
          game.id === action.payload.id
            ? { ...game, status: action.payload.status }
            : game
        )
      };
      break;

    case 'TOGGLE_THEME':
      newState = {
        ...state,
        darkMode: !state.darkMode
      };
      break;

    case 'LOAD_SAVED_DATA':
      newState = {
        ...state,
        collection: action.payload
      };
      break;

    default:
      newState = state;
  }

  
  try {
    localStorage.setItem('gameCollection', JSON.stringify(newState.collection));
    localStorage.setItem('darkMode', JSON.stringify(newState.darkMode));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }

  return newState;
};

export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, loadInitialState());

 
  useEffect(() => {
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.darkMode]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};