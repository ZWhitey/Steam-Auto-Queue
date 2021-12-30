const SteamUser = require('./user.js');


(async () => {
  try {
    const User = require('./config.json');
    for (let i of User) {
      await getClient(i);
      await sleep(7); // sleep prevent steam temporary ban connection
    }

  }
  catch (err) {
    if (err.message.search('Cannot find module') != -1) {
      console.log('No config file, using standard input');
      new SteamUser();
    }
    else {
      console.error(err.message);
    }
  }
})();

function getClient(data) {
  return new Promise(resolve => {
    new SteamUser(data);
    resolve();
  })
}

function sleep(second) {
  return new Promise(resolve => {
    setTimeout(resolve, second * 1000);
  })
}