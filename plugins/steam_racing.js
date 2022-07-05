/**
 * 
 * @param {object} plugin 
 * @param {string} plugin.name  # plugin name
 * @param {string} plugin.script # script file name
 * @param {boolean} plugin.enable # enable or disable plugin
 * @param {object} plugin.data # data you want to pass to the script
 */
module.exports = async function (plugin) {
  console.info(`[${this.data.account}]: Start racing`);
  const raceApp = race.bind(this);
  await raceApp();
  return;

  function race() {
    return new Promise((resolve, reject) => {
      this.community.request.post({ url: 'https://store.steampowered.com/saleaction/ajaxopendoor', form: { sessionid: this.community.getSessionID(), authwgtoken: this.community.oAuthToken, door_index: 5 } }, (err, res, body) => {
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
