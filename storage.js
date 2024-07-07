const fs = require('fs');
const DB_FILE = './cookies.db';
const REFRESH_FILE = './refresh.db';

module.exports = class Storage {
  constructor() {
    try {
      if (fs.existsSync(DB_FILE)) {
        console.log('[storage] find deprecated db file, remove it');
        fs.unlinkSync(DB_FILE);
      }
      this.refresh = fs.existsSync(REFRESH_FILE)
        ? JSON.parse(fs.readFileSync(REFRESH_FILE))
        : {};
    } catch (err) {
      console.error('[storage] load db file failed, clear db file');
      this.refresh = {};
      this.saveToFile();
    }
  }

  saveRefreshToken(user, token) {
    this.refresh[user] = token;
    this.saveToFile();
  }

  removeRefreshToken(user) {
    delete this.refresh[user];
    this.saveToFile();
  }

  getRefreshToken(user) {
    return this.refresh[user];
  }

  saveToFile() {
    fs.writeFileSync(REFRESH_FILE, JSON.stringify(this.refresh));
  }
};
