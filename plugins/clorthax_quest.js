const cheerio = require('cheerio');
/**
 * 
 * @param {object} plugin 
 * @param {string} plugin.name  # plugin name
 * @param {string} plugin.script # script file name
 * @param {boolean} plugin.enable # enable or disable plugin
 * @param {object} plugin.data # data you want to pass to the script
 */
module.exports = async function (plugin) {
  console.info(`[${this.data.account}]: Start clorthax quest`);
  const post = postPromise.bind(this);
  const get = getPromise.bind(this);
  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
  const payload = {
    sessionid: this.community.getSessionID(),
    authwgtoken: this.community.oAuthToken,
    door_index: 0,
    clan_accountid: 41316928
  };
  await post('https://store.steampowered.com/saleaction/ajaxopendoor', payload);
  const links = [
    'https://store.steampowered.com/category/arcade_rhythm/?snr=1_614_615_clorthaxquest_1601',
    'https://store.steampowered.com/category/strategy_cities_settlements/?snr=1_614_615_clorthaxquest_1601',
    'https://store.steampowered.com/category/sports/?snr=1_614_615_clorthaxquest_1601',
    'https://store.steampowered.com/category/simulation/?snr=1_614_615_clorthaxquest_1601',
    'https://store.steampowered.com/category/multiplayer_coop/?snr=1_614_615_clorthaxquest_1601',
    'https://store.steampowered.com/category/casual/?snr=1_614_615_clorthaxquest_1601',
    'https://store.steampowered.com/category/rpg/?snr=1_614_615_clorthaxquest_1601',
    'https://store.steampowered.com/category/horror/?snr=1_614_615_clorthaxquest_1601',
    'https://store.steampowered.com/vr/?snr=1_614_615_clorthaxquest_1601',
    'https://store.steampowered.com/category/strategy/?snr=1_614_615_clorthaxquest_1601',
  ];
  for (let link of links) {
    try {
      const html = await get(link);
      const $ = cheerio.load(html);
      if (!$('#application_config').data('capsuleinsert')) {
        console.log(`skip ${link} with no data`);
        continue;
      }
      await post('https://store.steampowered.com/saleaction/ajaxopendoor', {
        sessionid: this.community.getSessionID(),
        authwgtoken: this.community.oAuthToken,
        door_index: $('#application_config').data('capsuleinsert').payload,
        clan_accountid: 41316928,
        datarecord: $('#application_config').data('capsuleinsert').datarecord,
      });
    }

    catch (e) {
      console.error('Failed to obtain badge!', e);
    } finally {
      await sleep(2000);
    }
  }
  await post('https://store.steampowered.com/saleaction/ajaxopendoor', {
    sessionid: this.community.getSessionID(),
    authwgtoken: this.community.oAuthToken,
    door_index: 11,
    clan_accountid: 39049601,
  });
};

function postPromise(url, data) {
  return new Promise((resolve, reject) => {
    this.community.request.post({ url, form: data }, (err, res, body) => {
      if (err) {
        console.error(`[${this.data.account}]`, err.message);
        reject();
      }
      if (!body) {
        console.error(`[${this.data.account}]`, res.statusCode);
        reject();
      }
      resolve();
    });
  });
}

function getPromise(url) {
  return new Promise((resolve, reject) => {
    this.community.request.get({ url }, (err, res, body) => {
      if (err) {
        console.error(`[${this.data.account}]`, err.message);
        reject();
      }
      if (!body) {
        console.error(`[${this.data.account}]`, res.statusCode);
        reject();
      }
      resolve(body);
    });
  });
}
