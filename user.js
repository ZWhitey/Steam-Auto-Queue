const prompt = require('prompt-sync')();
const SteamTotp = require('steam-totp');
const SteamCommunity = require('steamcommunity');
const NodeSteamUser = require('steam-user');
const _ = require('lodash');
const Plugins = require('./plugins.json');
const Storage = require('./storage');
const storage = new Storage();

module.exports = class SteamUser {
  constructor(data) {
    this.end = false;
    this.mods = {};
    this.data = data ? data : {};
    this.community = new SteamCommunity();
    this.user = new NodeSteamUser({ renewRefreshTokens: true });

    this.data.account = this.data.account
      ? this.data.account
      : prompt('Enter your account: ');

    this.refreshToken = storage.getRefreshToken(this.data.account);
    if (_.isNil(this.refreshToken)) {
      this.data.password = this.data.password
        ? this.data.password
        : prompt('Enter your password: ', { echo: '*' });
    } else {
      console.log(`[${this.data.account}] login with refresh token`);
    }
    this.initSteamUser();
  }

  async initSteamUser() {
    const loginData = {};
    if (_.isNil(this.refreshToken)) {
      loginData.accountName = this.data.account;
      loginData.password = this.data.password;
      if (this.data.shared_secret) {
        loginData.twoFactorCode = SteamTotp.generateAuthCode(
          this.data.shared_secret
        );
      }
    } else {
      loginData.refreshToken = this.refreshToken;
    }

    this.user.logOn(loginData);

    this.user.on('loggedOn', () => {
      console.log(`[${this.data.account}] logged on steam`);
    });

    this.user.on('refreshToken', (token) => {
      console.log(`[${this.data.account}] save refresh token`);
      storage.saveRefreshToken(this.data.account, token);
    });

    this.user.on('error', (err) => {
      console.error(`[${this.data.account}]`, err);
    });

    this.user.on('webSession', async (sessionID, cookies) => {
      console.log(`[${this.data.account}] login web session`);
      this.community.setCookies(cookies);
      try {
        this.loadMods();
      } catch (err) {
        console.error(`[${this.data.account}]`, 'load mods with error: ', err);
      } finally {
        this.end = true;
        this.user.logOff();
      }
    });
  }

  async loadMods() {
    for (let plugin of Plugins) {
      if (plugin.enable) {
        console.log(`[${this.data.account}] Loading plugin: ${plugin.name}`);
        this.mods[plugin.name] = require(`./plugins/${plugin.script}`).bind(
          this
        );
        try {
          await this.mods[plugin.name](plugin);
        } catch (err) {
          console.error(
            `[${this.data.account}]`,
            'run plugin with error: ',
            err
          );
        }
      }
    }
    this.end = true;
  }
};
