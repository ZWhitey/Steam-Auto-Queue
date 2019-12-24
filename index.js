const prompt = require('prompt-sync')();
const SteamTotp = require('steam-totp');
const SteamCommunity = require('steamcommunity');
const cheerio = require("cheerio");

try{
    var User = require('./config.json');
}
catch(err){
    console.log('No config file, using standard input');
    var User = {};
}

const community = new SteamCommunity();
var logData = {};

logData.accountName = User.account?User.account:prompt('Enter your account: ');
logData.password = User.password?User.password:prompt('Enter your password: ',{echo:'*'});
logData.twoFactorCode = User.shared_secret?SteamTotp.generateAuthCode(User.shared_secret):prompt('Enter your auth code: ');


community.login(logData,err=>{
    if(err){
        console.error(err.message);
        return;
    }
    console.log('Account logged');
    getCard();
})

function getCard() {
    community.request.get({url:'https://store.steampowered.com/explore/'},(err,res,body)=>{
        if(err || !body){
            console.error(err.message);
            return;
        }
        const $ = cheerio.load(body);
        var text = $('.subtext').text();
        const end = text.search(' more cards today by continuing to browse your Discovery Queue.');
        const cardRemain = parseInt(text.substr(11,end));
        if(cardRemain){
            console.log('Discovering queue');
            console.log('Card Remain: ',cardRemain);
            explore(cardRemain);
        }
        else
            console.log('No card remain');
    })
}

function explore(remain) {
    community.request.post({url:'https://store.steampowered.com/explore/generatenewdiscoveryqueue',form:{'sessionid':community.getSessionID() ,queuetype:0}},(err,res,body)=>{
        if(err || !body){
            console.error(err.message);
            return;
        }
        data = JSON.parse(body);
        queueFin = [];
        data.queue.forEach(appid => {
            queueFin.push(community.request.post({url:'https://store.steampowered.com/app/60',
                                    form:{appid_to_clear_from_queue:appid,sessionid:community.getSessionID()}}));  
        });
        Promise.all(queueFin).then(()=>{
            if(remain - 1 > 0){
                console.log('Card Remain: ',remain - 1);
                explore(remain - 1);
            }
            else{
                console.log('Queue Finished');
            }
        },res=>{
            console.log('Error: ',res);  
        })
    }); 
}