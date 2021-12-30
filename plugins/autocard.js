/**
 * 
 * @param {object} plugin 
 * @param {string} plugin.name  # plugin name
 * @param {string} plugin.script # script file name
 * @param {boolean} plugin.enable # enable or disable plugin
 * @param {object} plugin.data # data you want to pass to the script
 */
module.exports = function (plugin) {
  return new Promise((resolve, reject) => {
    this.community.request.post({ url: 'https://store.steampowered.com/explore/generatenewdiscoveryqueue', form: { 'sessionid': this.community.getSessionID(), queuetype: 0 } }, (err, res, body) => {
      if (err) {
        console.error(`[${this.data.account}]`, err.message);
        return reject();
      }
      if (!body) {
        console.error(`[${this.data.account}]`, res.statusCode);
        return reject();
      }
      if (res.statusCode !== 200) {
        console.error(`[${this.data.account}] ${res.statusCode} ${res.statusMessage}`);
        return reject();
      }
      try {
        var data = JSON.parse(body);
        var queueFin = [];
        data.queue.forEach((appid) => {
          queueFin.push(this.community.request.post({
            url: 'https://store.steampowered.com/app/60',
            form: { appid_to_clear_from_queue: appid, sessionid: this.community.getSessionID() }
          }));
        });
        Promise.all(queueFin).then(() => {
          console.log(`[${this.data.account}] Queue Finished`);
          return resolve();
        }, (res) => {
          console.error(`[${this.data.account}]`, res);
          return reject();
        });
      }
      catch (err) {
        console.error(`[${this.data.account}]`, err);
        return reject();
      }
    });
  });
}
