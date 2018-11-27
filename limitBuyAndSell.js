const Coss = require('./index')();

export function limitBuyAndSell(pair, ethOrdersize, profit, sellPercent, oldBuyOrder) {
    
    Coss.getMarketSides({Symbol: pair}).then((marketSides) => {    
        setTimeout(() => {

            Coss.getOrderDetails({ID: oldBuyOrder.order_id}).then((oldOrderStatus) => {    
                setTimeout(() => {    

                    const buyPrice = parseInt((marketSides[0][0] + marketSides[1][0]) / 2 * 100000000, 10) / 100000000;
                    const buyAmmount = parseInt((ethOrdersize / buyPrice) * 100000000, 10) / 100000000;
                    console.log(buyPrice);
                    
                    Coss.placeLimitOrder({Symbol: pair, Side: 'Buy', Price: Number(buyPrice), Amount: Number(buyAmmount)}).then(() => {
                        setTimeout(() => {
                        }, 3000);
                    })     
                }, 3000);
            });
        }, 3000);
    });
}
/*
Coss.cancelOrder({ID: oldBuyOrder.order_id, Symbol: pair}).then(() => {
                        setTimeout(() => {*/