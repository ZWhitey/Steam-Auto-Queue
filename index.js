const AutoCard = require('./autocard.js');


main();
async function main(){
    try{
        var User = require('./config.json');
        for(let i of User){
            await getClient(i);
            await sleep(7);
        }

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
}


async function getClient(data) {
    return new Promise(resolve=>{
        new AutoCard(data);
        resolve();
    })
}

async function sleep(second) {
    return new Promise(resolve=>{
        setTimeout(resolve, second * 1000);
    })
}