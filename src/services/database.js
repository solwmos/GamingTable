import storage from "../storage";

const DB = {
  async getUsers() {
    try {
      const result = await storage.get('users');
      return result ? JSON.parse(result.value) : [];
    } catch {
      return [];
    }
  },
  async saveUsers(users) {
    await storage.set('users', JSON.stringify(users));
  },
  async getTables() {
    try {
      const result = await storage.get('gaming-tables');
      return result ? JSON.parse(result.value) : [];
    } catch {
      return [];
    }
  },
  async saveTables(tables) {
    await storage.set('gaming-tables', JSON.stringify(tables));
  },
  async getCurrentUser() {
    try {
      const result = await storage.get('current-user');
      return result ? JSON.parse(result.value) : null;
    } catch {
      return null;
    }
  },
  async setCurrentUser(user) {
    if (user) {
      await storage.set('current-user', JSON.stringify(user));
    } else {
      await storage.delete('current-user');
    }
  }
};

export default DB;
