import axios from 'axios';

const API_KEY = 'e7d848cc89f541a081fc3b13b6cbaa05';
const BASE_URL = 'https://api.rawg.io/api';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    key: API_KEY,
  },
});

export const getGames = async (params = {}) => {
  try {
    const response = await api.get('/games', {
      params: {
        ...params,
        page_size: params.page_size || 20,
        search_precise: true,
        search_exact: false,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching games:', error);
    throw error;
  }
};

export const getGameDetails = async (id) => {
  try {
    const response = await api.get(`/games/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching game details:', error);
    throw error;
  }
};

export const getGameScreenshots = async (id) => {
  try {
    const response = await api.get(`/games/${id}/screenshots`);
    return response.data;
  } catch (error) {
    console.error('Error fetching game screenshots:', error);
    throw error;
  }
};

export const getGameStores = async (id) => {
  try {
    const response = await api.get(`/games/${id}/stores`);
    return response.data;
  } catch (error) {
    console.error('Error fetching game stores:', error);
    throw error;
  }
};

export const PLATFORMS = {
  pc: 4,
  playstation: 187,
  xbox: 1,
  nintendo: 7
};

export const GENRES = {
  action: 4,
  rpg: 5,
  strategy: 10,
  shooter: 2
};