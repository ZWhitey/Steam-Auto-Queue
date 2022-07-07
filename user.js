const prompt = require('prompt-sync')();
const SteamTotp = require('steam-totp');
const SteamCommunity = require('steamcommunity');
const Plugins = require('./plugins.json');
const Storage = require('./storage');
const storage = new Storage();

module.exports = class SteamUser {
  constructor(data) {
    this.mods = {};
    this.data = data ? data : {};
    this.community = new SteamCommunity();

    this.data.account = this.data.account ? this.data.account : prompt('Enter your account: ');
    this.data.password = this.data.password ? this.data.password : prompt('Enter your password: ', { echo: '*' });

    const cookie = storage.getCookie(this.data.account);
    if (cookie) {
      this.initWithCookie(cookie);
    } else {
      this.init();
    }
  }

  async initWithCookie(cookie) {
    this.community.setCookies(cookie);
    if (await this.loggedIn()) {
      console.log(`[${this.data.account}] login with cookie`);
      await this.loadMods();
    } else {
      console.log(`[${this.data.account}] cookie expired try to relogin`);
      storage.removeCookie(this.data.account);
      await this.init();
    }
  }

  async init() {
    const loginData = {
      accountName: this.data.account,
      password: this.data.password,
    };
    loginData.twoFactorCode = this.data.shared_secret ? SteamTotp.generateAuthCode(this.data.shared_secret) : undefined;
    try {
      await this.login(loginData);
      console.log(`${loginData.accountName} logged into steam`);
      await this.loadMods();
    } catch (err) {
      if (err.message === 'SteamGuard') {
        const authCode = prompt(`[${this.data.account}] Enter your auth code from email: `);
        await this.login({ ...loginData, authCode });
        console.log(`${loginData.accountName} logged into steam`);
        await this.loadMods();
      } else if (err.message === 'SteamGuardMobile') {
        const twoFactorCode = prompt(`[${this.data.account}] Enter your auth code from mobile: `);
        await this.login({ ...loginData, twoFactorCode });
        console.log(`${loginData.accountName} logged into steam`);
        await this.loadMods();
      } else {
        console.error(`[${this.data.account}]`, 'login failed ', err.message);
        throw err;
      }
    }
  }

  async loadMods() {
    for (let plugin of Plugins) {
      if (plugin.enable) {
        console.log(`[${this.data.account}] Loading plugin: ${plugin.name}`);
        this.mods[plugin.name] = require(`./plugins/${plugin.script}`).bind(this);
        try {
          await this.mods[plugin.name](plugin);
        } catch (err) {
          console.error(`[${this.data.account}]`, 'run plugin with error: ', err);
        }
      }
    }
  }

  login(loginData) {
    return new Promise((resolve, reject) => {
      this.community.login(loginData, (err, sid, cookies) => {
        if (err) {
          return reject(err);
        }
        storage.saveCookie(this.data.account, cookies);
        return resolve();
      });
    });
  }

  loggedIn() {
    return new Promise((resolve) => {
      this.community.loggedIn((err, loggedIn) => {
        if (err) {
          return resolve(false);
        }
        return resolve(loggedIn);
      });
    });
  }


};