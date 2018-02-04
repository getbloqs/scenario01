const SportsBet = artifacts.require("./SportsBet.sol");
const utils = require('./utils');

contract('SportsBet', function(accounts) {

    it('Should bet on a contract an end of betting timestamp in the future', function() {
        let sportsBet;

        return SportsBet.new('An example bet', utils.unixNow(1000)).then((instance) => {
            sportsBet = instance;            
            return sportsBet.bet(1, { from:accounts[1] , value:12345 });       
        }).then(() => {
            assert.isTrue(true);
        });
    });

    it('Adding some bets and check the stats', function() {
        let sportsBet;
        let bets = [123445, 2356, 9984785];
        bets[3] = bets[0] + bets[1] + bets[2];

        return SportsBet.new('An example bet', utils.unixNow(1000)).then((instance) => {
            sportsBet = instance;

            return Promise.all([
                sportsBet.bet(1, { from:accounts[1] , value:bets[0] }) ,
                sportsBet.bet(2, { from:accounts[2] , value:bets[1] }) ,
                sportsBet.bet(3, { from:accounts[3] , value:bets[2] }) ,
            ]);        
        }).then(() => {           
            return Promise.all([
                sportsBet.amounts.call(0),
                sportsBet.amounts.call(1),
                sportsBet.amounts.call(2),                
                sportsBet.total.call()
            ]);            
        }).then((amounts) => {
            // check amounts for correctness
            assert.equal(bets[0], amounts[0].toNumber());
            assert.equal(bets[1], amounts[1].toNumber());
            assert.equal(bets[2], amounts[2].toNumber());
            assert.equal(bets[3], amounts[3].toNumber()); 

            return Promise.all([
                sportsBet.calculateOdds(1) ,
                sportsBet.calculateOdds(2) ,
                sportsBet.calculateOdds(3)
            ]);
        }).then(odds => {
            let winnings = [
                (bets[0] * odds[0].toNumber()),
                (bets[1] * odds[1].toNumber()),
                (bets[2] * odds[2].toNumber())
            ];

            assert.isBelow( winnings[0], bets[3] );
            assert.isBelow( winnings[1], bets[3] );
            assert.isBelow( winnings[2], bets[3] );

            return Promise.all([
                sportsBet.betAmounts(accounts[1]) ,
                sportsBet.betAmounts(accounts[2]) ,
                sportsBet.betAmounts(accounts[3])
            ]);
        }).then((results) => {
            assert.equal(results[0].toNumber(), bets[0]);
            assert.equal(results[1].toNumber(), bets[1]);
            assert.equal(results[2].toNumber(), bets[2]);
        });        
    });

});