// Mock API to simulate backend functionality
// This will be replaced with real API calls later

const STORAGE_KEYS = {
  PARTICIPANTS: 'roulette_participants',
  WINNERS: 'roulette_winners'
};

// Default participants for demonstration
const DEFAULT_PARTICIPANTS = [
  'Ana García',
  'Carlos Rodríguez',
  'María López',
  'José Martínez',
  'Laura González',
  'Pablo Sánchez'
];

const mockApi = {
  // Get current participants
  getParticipants: async () => {
    const stored = localStorage.getItem(STORAGE_KEYS.PARTICIPANTS);
    return stored ? JSON.parse(stored) : DEFAULT_PARTICIPANTS;
  },

  // Update participants list
  updateParticipants: async (participants) => {
    localStorage.setItem(STORAGE_KEYS.PARTICIPANTS, JSON.stringify(participants));
    return participants;
  },

  // Get winners history
  getWinners: async () => {
    const stored = localStorage.getItem(STORAGE_KEYS.WINNERS);
    return stored ? JSON.parse(stored) : [];
  },

  // Spin the roulette and return a winner
  spin: async (participants) => {
    if (participants.length === 0) {
      throw new Error('No participants available');
    }

    // Simulate spinning delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // Select random winner
    const randomIndex = Math.floor(Math.random() * participants.length);
    const winnerName = participants[randomIndex];

    // Get current winners to determine position
    const currentWinners = await mockApi.getWinners();
    const position = currentWinners.length + 1;

    const winner = {
      name: winnerName,
      position: position,
      timestamp: new Date().toISOString(),
      totalParticipants: participants.length
    };

    // Save winner to history
    const updatedWinners = [...currentWinners, winner];
    localStorage.setItem(STORAGE_KEYS.WINNERS, JSON.stringify(updatedWinners));

    return winner;
  },

  // Reset the entire game
  resetGame: async () => {
    localStorage.removeItem(STORAGE_KEYS.WINNERS);
    localStorage.setItem(STORAGE_KEYS.PARTICIPANTS, JSON.stringify(DEFAULT_PARTICIPANTS));
    
    return {
      participants: DEFAULT_PARTICIPANTS,
      winners: []
    };
  },

  // Clear winners history only
  clearWinners: async () => {
    localStorage.removeItem(STORAGE_KEYS.WINNERS);
    return [];
  }
};

export { mockApi };