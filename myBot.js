const Coss = require('./index')();
var CronJob = require('cron').CronJob;
const fs = require('fs');

const cronInterval = '0 */'+ process.env.TIME_INTERVAL +' * * * *' ;
//var buyETHBTC = true
//var oldETHBTC = null;

new CronJob(cronInterval, async function() {
    
    const eth = (await Coss.getAccountBalances())[68];
    var buy = parseFloat(process.env.ETH_ORDER_SIZE);                           //0.004
    if(eth && eth.currency_code == 'ETH' && eth.available > 0.8) buy += buy;    //0.008
    if(eth && eth.currency_code == 'ETH' && eth.available > 1.2) buy += buy;    //0.016
    setTimeout(async () => {
        await marketBuyAndLimitSell(buy);
    }, 3000);

//    if(buyETHBTC){
//    }
//    buyETHBTC = !buyETHBTC;

}, null, true, 'America/Los_Angeles');

/** LOGIC */

async function marketBuyAndLimitSell(ethAmmount) {

    try {

        const marketSides = await Coss.getMarketSides({Symbol: "coss-eth"});
        //console.log("..........."+marketSides+"...........");
        const askPrice = marketSides[1][0];
        const askAmmount = marketSides[1][1];
        
        const sellAt = parseInt(askPrice * process.env.PROFIT * 100000000,10) / 100000000;
        const wantToBuy = parseInt((ethAmmount / askPrice)*1000, 10) / 1000;  //buy 22.4 coss
        const ammount = wantToBuy > askAmmount ? askAmmount : wantToBuy;  //if less coss is available, less will be bought
        
        try{//BUY

            await Coss.placeLimitOrder({Symbol: 'coss-eth', Side: 'Buy', Price: Number(askPrice), Amount: Number(ammount)});
            log(`bought ${ammount} coss @${askPrice}`, 'history.txt', true);

            setTimeout(async () => {

                try{//SELL
                    const ammountTosell = parseInt(ammount * process.env.SELL_COSS * 100, 10) / 100;
                    s = await Coss.placeLimitOrder({Symbol: 'coss-eth', Side: 'Sell', Price: Number(sellAt), Amount: Number(ammountTosell)});
                    //console.log(s)
                    log(`selling ${ammountTosell} coss @${sellAt}`, 'history.txt', true);
                    
                } catch(err){
                    console.log(err);
                    log('Error placing limit sell order', 'history.txt', true);
                    //mySellOrder.then((p)=> {
                    //    log(err + ' ' + p, 'errors.txt', false);
                    //});
                }
            }, 3000);

        } catch(err){
            console.log(err);
            log('Error buying', 'history.txt', true);
            //myBuyOrder.then((p)=> {
            //    log(err + ' ' + p, 'errors.txt', false);
            //});
        }

    } catch(err){
        console.log(err);
        log('Error getting data', 'history.txt', true);
        //marketSides.then((p)=> {
        //    log(err + ' ' + p, 'errors.txt', false);
        //});
    }
}

function log(text, file, logToConsole) {

    if(logToConsole) {
        console.log(new Date() + " ... " + text);
    }
    fs.appendFile(file, new Date() + ' ...  ' + text + "\n", function (err) {
        if (err) throw err;
    });
}
/*200 order
{ account_id: 'be96ca0e-6e8a-41ab-936c-87da2e7472c6',
  order_side: 'BUY',
  status: 'open',
  order_id: '5880732b-676d-4f64-bedb-b521d5f701c1',
  order_size: '6.7',
  order_price: '0.00044299',
  total: '0.00296803 eth',
  createTime: 1542489302416,
  order_symbol: 'coss-eth',
  avg: '0.00000000',
  executed: '0',
  stop_price: '0.00000000',
  type: 'limit' }*/