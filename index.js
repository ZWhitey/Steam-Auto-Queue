const AutoCard = require('./autocard.js');

try{
    var User = require('./config.json');
    User.forEach(data => {
        new AutoCard(data);
    });
}
catch(err){
    if(err.message.search('Cannot find module') != -1){
        console.log('No config file, using standard input');
        new AutoCard();
    }
    else{
        console.error(err.message);
    }
}

