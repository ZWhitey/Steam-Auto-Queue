const AutoCard = require('./autocard.js');

try{
    var User = require('./config.json');
}
catch(err){
    console.log('No config file, using standard input');
}

if(User){
    User.forEach(data => {
        new AutoCard(data);
    });
}
else{
    new AutoCard()
}
