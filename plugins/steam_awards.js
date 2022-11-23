/**
 *
 * @param {object} plugin
 * @param {string} plugin.name  # plugin name
 * @param {string} plugin.script # script file name
 * @param {boolean} plugin.enable # enable or disable plugin
 * @param {object} plugin.data # data you want to pass to the script
 */
module.exports = async function (plugin) {
  console.info(`[${this.data.account}]: Start nominating`);
  const { nominates } = plugin.data;
  const nominateApp = nominate.bind(this);
  for (let i = 0; i < nominates.length; i += 1) {
    console.log(`[${this.data.account}]: Nominating ${i + 1} / ${nominates.length}`);
    try {
      await nominateApp(nominates[i].nominatedid, nominates[i].categoryid);
    } catch (err) {
      console.log(err);
      throw(err);
    }
  }
  return;

  function nominate(nominatedid, categoryid) {
    return new Promise((resolve, reject) => {
      this.community.request.post({ url: 'https://store.steampowered.com/steamawards/nominategame', form: { 'sessionid': this.community.getSessionID(), nominatedid, categoryid, source: 3 } }, (err, res, body) => {
        if (err) {
          console.error(`[${this.data.account}]`, err.message);
          reject();
        }
        if (!body) {
          console.error(`[${this.data.account}]`, res.statusCode);
          reject();
        }
        console.log(`[${this.data.account}]: nominatedid: ${nominatedid} categoryid: ${categoryid}`);
        resolve();
      });
    });
  }
};
