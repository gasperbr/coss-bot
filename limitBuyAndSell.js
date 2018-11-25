const Coss = require('./index')();

export function limitBuyAndSell(pair, ordersize, profit, sellPercent, oldBuyOrder) {
       
    const marketSides = await Coss.getMarketSides({Symbol: pair}).then(() => {

    });
    const buyPrice = marketSides[0][0] + 0.00000001;
    setTimeout(() => {
        const buy = await Coss.placeLimitOrder(
            {Symbol: pair, Side: 'Buy', Price: Number(buyPrice), Amount: Number(ethSize)}
            ).then((err, data) => {
                return err;
            }).catch((err) => {
                return "fucc";
            });
    }, 3000);
}