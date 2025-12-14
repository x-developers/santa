export const api = {
  async createGame() {
    const res = await fetch('/api/games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    if (!res.ok) throw new Error('Failed to create game');
    return res.json();
  },

  async getGame(code) {
    const res = await fetch(`/api/games/${code}`);
    if (!res.ok) throw new Error('Game not found');
    return res.json();
  },

  async addParticipant(code, name, wishlist) {
    const res = await fetch(`/api/games/${code}/participants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, wishlist: wishlist || null })
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.detail || 'Error');
    }
    return res.json();
  },

  async removeParticipant(code, participantId) {
    await fetch(`/api/games/${code}/participants/${participantId}`, {
      method: 'DELETE'
    });
  },

  async shuffle(code) {
    const res = await fetch(`/api/games/${code}/shuffle`, {
      method: 'POST'
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.detail || 'Error');
    }
    return res.json();
  },

  async reshuffle(code) {
    const res = await fetch(`/api/games/${code}/reshuffle`, {
      method: 'POST'
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.detail || 'Error');
    }
    return res.json();
  },

  async getAssignment(token) {
    const res = await fetch(`/api/participant/${token}`);
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.detail || 'Error');
    }
    return res.json();
  }
};
