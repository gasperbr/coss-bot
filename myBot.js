const Coss = require('./index')();
var CronJob = require('cron').CronJob;

const cronInterval = '0 */'+ process.env.TIME_INTERVAL +' * * * *' ;

new CronJob(cronInterval, function() {

  marketBuyAndLimitSell(process.env.ETH_ORDER_SIZE);

}, null, true, 'America/Los_Angeles');

/** LOGIC */

async function marketBuyAndLimitSell(ethAmmount) {
    try{

        const marketSides = await Coss.getMarketSides({Symbol: "coss-eth"});
        const askPrice = marketSides[1][0];
        const askAmmount = marketSides[1][1];
        
        const sellAt = askPrice * process.env.PROFIT;
        const wantToBuy = parseInt((ethAmmount / askPrice)*10, 10) / 10;  //buy 22.4 coss
        const ammount = wantToBuy > askAmmount ? askAmmount : wantToBuy;  //if less coss is available, less will be bought

        try{//BUY

            const myBuyOrder = await Coss.placeLimitOrder({Symbol: 'coss-eth', Side: 'Buy', Price: Number(askPrice), Amount: Number(ammount)});
            console.log(`bought ${ammount} coss @${askPrice}`);
            setTimeout(async () => {   
                try{//SELL
                    
                    const mySellOrder = await Coss.placeLimitOrder({Symbol: 'coss-eth', Side: 'Sell', Price: Number(sellAt), Amount: Number(ammount * process.env.SELL_COSS)});
                    console.log(`selling ${ammount} coss @${sellAt}`);
                    
                } catch(err){
                    console.log("fucked up selling-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-");
                    console.log(err);
                }
            }, 3000);

        } catch(err){
            console.log("fucked up buying-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-");
            console.log(err);
        }

    } catch(err){
        console.log("fucked up-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-");
        console.log(err);
    }
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