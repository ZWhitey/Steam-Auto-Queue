const SteamUser = require('./user.js');


(async () => {
  try {
    const User = require('./config.json');
    for (let i of User) {
      await getClient(i);
      await sleep(10); // sleep prevent steam temporary ban connection
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
    const user = new SteamUser(data);
    const timer = setInterval(() => {
      if (user.end) {
        clearInterval(timer);
        resolve();
      }
    }, 250);
  });
}

function sleep(second) {
  return new Promise(resolve => {
    setTimeout(resolve, second * 1000);
  });
}