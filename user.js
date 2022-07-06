const prompt = require('prompt-sync')();
const SteamTotp = require('steam-totp');
const SteamCommunity = require('steamcommunity');
const Plugins = require('./plugins.json');

module.exports = class SteamUser {
  constructor(data) {
    this.mods = {};
    this.data = data ? data : {};
    this.community = new SteamCommunity();

    this.data.account = this.data.account ? this.data.account : prompt('Enter your account: ');
    this.data.password = this.data.password ? this.data.password : prompt('Enter your password: ', { echo: '*' });

    this.init();
  }

  login(loginData) {
    return new Promise((resolve, reject) => {
      this.community.login(loginData, (err) => {
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    });
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
        const authCode = prompt('Enter your auth code from email: ');
        await this.login({ ...loginData, authCode });
        console.log(`${loginData.accountName} logged into steam`);
        await this.loadMods();
      } else if (err.message === 'SteamGuardMobile') {
        const twoFactorCode = prompt('Enter your auth code from mobile: ');
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

};