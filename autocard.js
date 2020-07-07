const prompt = require('prompt-sync')();
const SteamTotp = require('steam-totp');
const SteamCommunity = require('steamcommunity');

module.exports = class autoCard{
    constructor(data, remain){
        this.data = data?data:{};
        this.remain = remain;
        this.community = new SteamCommunity();

        this.data.account = this.data.account?this.data.account:prompt('Enter your account: ');
        this.data.password = this.data.password?this.data.password:prompt('Enter your password: ',{echo:'*'});
        this.data.shared_secret = this.data.shared_secret?SteamTotp.generateAuthCode(this.data.shared_secret):prompt('Enter your auth code: ');

        let logData = {
            accountName : this.data.account,
            password : this.data.password,
            twoFactorCode : this.data.shared_secret
        };
        this.community.login(logData,err=>{
        if(err){
            console.error(`[${this.data.account}]`,err.message);
            return;
        }
            console.log(`${logData.accountName} logged into steam`);
            console.log(`[${this.data.account}] Discovering queue`);
            this.explore(this.remain);
        })
    }

    explore(remain) {
        this.community.request.post({url:'https://store.steampowered.com/explore/generatenewdiscoveryqueue',form:{'sessionid':this.community.getSessionID() ,queuetype:0}},(err,res,body)=>{
            if(err){
                console.error(`[${this.data.account}]`,err.message);
                return;
            }
            if(!body){
                console.error(`[${this.data.account}]`,res.statusCode);
                return;
            }
            if(res.statusCode !== 200){
                console.error(`[${this.data.account}] ${res.statusCode} ${res.statusMessage}`,);
                return;
            }
            try{
                var data = JSON.parse(body);
                var queueFin = [];
                data.queue.forEach(appid => {
                    queueFin.push(this.community.request.post({url:'https://store.steampowered.com/app/60',
                                            form:{appid_to_clear_from_queue:appid,sessionid:this.community.getSessionID()}}));  
                });
                Promise.all(queueFin).then(()=>{
                    if(remain - 1 > 0){
                        console.log(`[${this.data.account}] Queue Remain: ${remain - 1}`);
                        this.explore(remain - 1);
                    }
                    else{
                        console.log(`[${this.data.account}] Queue Finished`);
                    }
                },res => {
                    console.error(`[${this.data.account}]`,res);
                })
            }
            catch(err){
                console.error(`[${this.data.account}]`,err);
            }
        }); 
    }
}