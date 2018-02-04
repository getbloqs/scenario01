const SportsBetFactory = artifacts.require("./SportsBetFactory.sol");
const utils = require('./utils');

contract('SportsBetFactory', function(accounts) {

    it('Should create several bets', function() {
        let factory;

        return SportsBetFactory.new().then((instance) => {
            factory = instance;            
            return Promise.all([
                factory.createSportsBet('game 1', utils.unixNow(1000)) ,
                factory.createSportsBet('game 2', utils.unixNow(1000)) ,
                factory.createSportsBet('game 3', utils.unixNow(1000)) ,
                factory.createSportsBet('game 4', utils.unixNow(1000))
            ]);
        }).then(() => {
            return Promise.all([
                factory.getBet(0) ,
                factory.getBet(1) ,
                factory.getBet(2) ,
                factory.getBet(3) ,
            ]);
        }).then((bets) => {
            assert.equal(bets[0][0], 'game 1');
            assert.equal(bets[1][0], 'game 2');
            assert.equal(bets[2][0], 'game 3');
            assert.equal(bets[3][0], 'game 4');
        });
    });

});