/**
 * 
 * @param {object} plugin 
 * @param {string} plugin.name  # plugin name
 * @param {string} plugin.script # script file name
 * @param {boolean} plugin.enable # enable or disable plugin
 * @param {object} plugin.data # data you want to pass to the script
 */
module.exports = async function (plugin) {
  console.info(`[${this.data.account}]: Start voting`);
  const { votes } = plugin.data;
  const voteApp = vote.bind(this);
  for (let i = 0; i < votes.length; i += 1) {
    console.log(`[${this.data.account}]: Voting ${i + 1} / ${votes.length}`);
    try {
      await voteApp(votes[i].voteid, votes[i].appid);
    } catch (err) {
      console.log(err);
      throw(err);
    }
  }
  return;

  function vote(voteid, appid) {
    return new Promise((resolve, reject) => {
      this.community.request.post({ url: 'https://store.steampowered.com/salevote', form: { 'sessionid': this.community.getSessionID(), voteid, appid, developerid: 0 } }, (err, res, body) => {
        if (err) {
          console.error(`[${this.data.account}]`, err.message);
          reject();
        }
        if (!body) {
          console.error(`[${this.data.account}]`, res.statusCode);
          reject();
        }
        console.log(`[${this.data.account}]: voteid: ${voteid} appid: ${appid}`);
        resolve();
      });
    });
  }
};
