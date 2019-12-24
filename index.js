const prompt = require('prompt-sync')();
const SteamTotp = require('steam-totp');
const SteamCommunity = require('steamcommunity');
const cheerio = require("cheerio");
const User = require('./config.json');

const community = new SteamCommunity();
var logData = {
    accountName:User.account,
    password:User.password
}
if(User.shared_secret){
    logData.twoFactorCode = SteamTotp.generateAuthCode(User.shared_secret);
}
else{
    logData.twoFactorCode = prompt('Enter your auth code: ');
}

community.login(logData,(err=>{
    if(err){
        console.log(err);
        return;
    }
    console.log('Account logged');
    getCard();
}))



function getCard() {

    community.request.get({url:'https://store.steampowered.com/explore/'},(err,res,body)=>{
        if(err || !body){
            console.log('Error',err);
            return;
        }
        const $ = cheerio.load(body);
        var text = $('.subtext').text();
        const end = text.search(' more cards today by continuing to browse your Discovery Queue.');

        const cardRemain = parseInt(text.substr(11,end));
        console.log('Discovering queue');
        console.log('Card Remain :',cardRemain);
        explore(cardRemain);
    })
}

function explore(remain) {
    community.request.post({url:'https://store.steampowered.com/explore/generatenewdiscoveryqueue',form:{'sessionid':community.getSessionID() ,queuetype:0}},(err,res,body)=>{
        if(err || !body){
            console.log('error',err);
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
                console.log('Card Remain :',remain - 1);
                explore(remain - 1);
            }
            else{
                console.log('Queue Finished');
            }
        },res=>{
            console.log('Error:',res);  
        })
    }); 
}