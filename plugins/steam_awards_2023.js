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
      this.community.request.get('https://store.steampowered.com/steamawards/nominations', (err, res, body) => {
        if (err) {
          console.error(err);
          return reject(err);
        }
        const $ = cheerio.load(body);
        const accessToken = JSON.parse($('#application_config').attr('data-store_user_config')).webapi_token;
        return resolve(accessToken);
      });
    });
  };

  console.info(`[${this.data.account}]: Start nominating`);
  const { nominates } = plugin.data;
  const token = await getAccessToken();
  const nominateApp = nominate.bind(this);
  for (let i = 0; i < nominates.length; i += 1) {
    console.log(`[${this.data.account}]: Nominating ${i + 1} / ${nominates.length}`);
    try {
      await nominateApp(token, nominates[i].encoded_data);
    } catch (err) {
      console.log(err);
      throw(err);
    }
  }
  return;

  function nominate(token, encoded_data) {
    return new Promise((resolve, reject) => {
      const url = `https://api.steampowered.com/ISteamAwardsService/Nominate/v1?access_token=${token}&origin=https:%2F%2Fstore.steampowered.com&input_protobuf_encoded=${encoded_data}`;
      this.community.request.get(url, (err, res, body) => {
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
};
