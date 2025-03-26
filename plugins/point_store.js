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
  const getAccessToken = () => {
    return new Promise((resolve, reject) => {
      this.community.request.get(
        'https://store.steampowered.com/greatondeck',
        (err, res, body) => {
          if (err) {
            console.error(err);
            return reject(err);
          }
          const $ = cheerio.load(body);
          const accessToken = JSON.parse(
            $('#application_config').attr('data-loyalty_webapi_token')
          );
          return resolve(accessToken);
        }
      );
    });
  };

  const run = (accessToken, item) => {
    return new Promise((resolve, reject) => {
      this.community.request.post(
        {
          url: `https://api.steampowered.com/ILoyaltyRewardsService/RedeemPoints/v1?access_token=${accessToken}`,
          form: item,
        },
        (err, res, body) => {
          if (err) {
            console.error(`[${this.data.account}]`, err.message);
            reject();
          }
          if (!body) {
            console.error(`[${this.data.account}]`, res.statusCode);
            reject();
          }
          resolve();
        }
      );
    });
  };

  const accessToken = await getAccessToken();
  console.log(`[${this.data.account}] Getting point store items`);
  for (const item of plugin.data.items) {
    await run(accessToken, item);
  }
};
