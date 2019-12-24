const prompt = require('prompt-sync')();
const SteamTotp = require('steam-totp');
const SteamCommunity = require('steamcommunity');
const cheerio = require("cheerio");

module.exports = class autoCard{
    constructor(data){
        this.data = data?data:{};
        this.community = new SteamCommunity();
        let logData = {};
        logData.accountName = this.data.account?this.data.account:prompt('Enter your account: ');
        logData.password = this.data.password?this.data.password:prompt('Enter your password: ',{echo:'*'});
        logData.twoFactorCode = this.data.shared_secret?SteamTotp.generateAuthCode(this.data.shared_secret):prompt('Enter your auth code: ');

        this.community.login(logData,err=>{
        if(err){
            console.error(err.message);
            return;
        }
            console.log(`${logData.accountName} logged into steam`);
            this.getCard();
        })
    }

    getCard() {
        this.community.request.get({url:'https://store.steampowered.com/explore/'},(err,res,body)=>{
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
                this.explore(cardRemain);
            }
            else
                console.log('No card remain');
        })
    }
    explore(remain) {
        this.community.request.post({url:'https://store.steampowered.com/explore/generatenewdiscoveryqueue',form:{'sessionid':community.getSessionID() ,queuetype:0}},(err,res,body)=>{
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
                    this.explore(remain - 1);
                }
                else{
                    console.log('Queue Finished');
                }
            },res=>{
                console.log('Error: ',res);  
            })
        }); 
    }
}