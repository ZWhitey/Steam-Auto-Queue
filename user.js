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
    this.data.shared_secret = this.data.shared_secret ? SteamTotp.generateAuthCode(this.data.shared_secret) : prompt('Enter your auth code: ');

    let logData = {
      accountName: this.data.account,
      password: this.data.password,
      twoFactorCode: this.data.shared_secret
    };
    this.community.login(logData, (err) => {
      if (err) {
        console.error(`[${this.data.account}]`, err.message);
        return;
      }
      console.log(`${logData.accountName} logged into steam`);
      this.loadMods();
    });
  }

  async loadMods() {
    for (let plugin of Plugins) {
      if (plugin.enable) {
        console.log(`[${this.data.account}] Loading ${plugin.name}`);
        this.mods[plugin.name] = require(`./plugins/${plugin.script}`).bind(this);
        await this.mods[plugin.name](plugin);
      }
    }
  }

};