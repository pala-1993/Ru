import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export const rouletteApi = {
  // Get current game
  getCurrentGame: async () => {
    try {
      const response = await api.get('/roulette/game');
      return response.data;
    } catch (error) {
      console.error('Error getting current game:', error);
      throw error;
    }
  },

  // Create new game
  createGame: async (participants = []) => {
    try {
      const response = await api.post('/roulette/game', { participants });
      return response.data;
    } catch (error) {
      console.error('Error creating game:', error);
      throw error;
    }
  },

  // Update participants
  updateParticipants: async (participants) => {
    try {
      const response = await api.put('/roulette/game/participants', { participants });
      return response.data;
    } catch (error) {
      console.error('Error updating participants:', error);
      throw error;
    }
  },

  // Spin the roulette
  spin: async () => {
    try {
      const response = await api.post('/roulette/spin');
      return response.data;
    } catch (error) {
      console.error('Error spinning roulette:', error);
      throw error;
    }
  },

  // Get winners
  getWinners: async () => {
    try {
      const response = await api.get('/roulette/winners');
      return response.data;
    } catch (error) {
      console.error('Error getting winners:', error);
      throw error;
    }
  },

  // Reset game
  resetGame: async () => {
    try {
      const response = await api.delete('/roulette/game/reset');
      return response.data;
    } catch (error) {
      console.error('Error resetting game:', error);
      throw error;
    }
  },

  // Get participants
  getParticipants: async () => {
    try {
      const response = await api.get('/roulette/participants');
      return response.data;
    } catch (error) {
      console.error('Error getting participants:', error);
      throw error;
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await api.get('/');
      return response.data;
    } catch (error) {
      console.error('Error with health check:', error);
      throw error;
    }
  }
};

export default rouletteApi;