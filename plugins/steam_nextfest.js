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
  const skipQueue = (appid, accessToken) => {
    return new Promise((resolve, reject) => {
      const skipUrl = `https://api.steampowered.com/IStoreService/SkipDiscoveryQueueItem/v1?access_token=${accessToken}`;
      const form = { 
        'queue_type': 1,
        'appid': appid,
        'store_page_filter': {
          'sale_filter': {
            'sale_tagid': 1235711
          },
          'store_filters': []
        }
      };
      this.community.request.post({
        url: skipUrl,
        form: {input_json: JSON.stringify(form)}
      }, (err, res, body) => {
        if (err) {
          console.error(err);
          return reject(err);
        }
        return resolve();
      });
    });
  };

  const getAppids = (accessToken) => {
    return new Promise((resolve, reject) => {
      const input_json = {
        'queue_type': 1,
        'country_code': 'TW',
        'rebuild_queue': true,
        'rebuild_queue_if_stale': true,
        'store_page_filter': {
          'sale_filter': {
            'sale_tagid': 1235711
          },
          'store_filters': []
        }};
      const url = `https://api.steampowered.com/IStoreService/GetDiscoveryQueue/v1?access_token=${accessToken}&input_json=${JSON.stringify(input_json)}`;
      this.community.request.get(url, async (err, res, body) => {
        if (err) {
          console.error(err);
          return reject(err);
        }
        const results = JSON.parse(body);
        const appids = results.response.appids;
        return resolve(appids);       
      });
    });
  };

  const getAccessToken = () => {
    return new Promise((resolve, reject) => {
      this.community.request.get('https://store.steampowered.com/sale/nextfest', (err, res, body) => {
        if (err) {
          console.error(err);
          return reject(err);
        }
        const $ = cheerio.load(body);
        const accessToken = JSON.parse($('#application_config').attr('data-loyalty_webapi_token'));
        return resolve(accessToken);
      });
    });
  };

  const run = async (accessToken) => {
    const appids = await getAppids(accessToken);
    for (const appid of appids) {
      await skipQueue(appid, accessToken);
    }
  };
 
  const accessToken = await getAccessToken();
  for (let i = 1; i <= 6; i += 1) {
    await run(accessToken);
    console.log(`[${this.data.account}] Queue Finished (${i}/6)`);
  }
};


