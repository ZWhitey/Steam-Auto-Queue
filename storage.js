const fs = require('fs');
const DB_FILE = './cookies.db';

module.exports = class Storage {

  constructor() {
    try {
      this.db = fs.existsSync(DB_FILE) ? JSON.parse(fs.readFileSync(DB_FILE)) : {};
    } catch (err) {
      console.error('[storage] load db file failed, clear db file');
      this.db = {};
      this.saveToFile();
    }
  }

  saveCookie(user, cookie) {
    this.db[user] = cookie;
    this.saveToFile();
  }

  removeCookie(user) {
    delete this.db[user];
    this.saveToFile();
  }

  getCookie(user) {
    return this.db[user];
  }

  saveToFile() {
    fs.writeFileSync(DB_FILE, JSON.stringify(this.db));
  }

};