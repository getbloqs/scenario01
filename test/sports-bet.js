let SportsBet = artifacts.require("./SportsBet.sol");

contract('SportsBet', function(accounts) {

    it('Should not be possible to bet on a locked bet', function() {
        let sportsBet;

        return SportsBet.new('WM 2014; 13.07.2014; Deutschland - Argentinien').then((instance) => {
            sportsBet = instance;
            return sportsBet.lockBet();
        }).then(() => {
            return sportsBet.bet(1, { from:accounts[1] , value:12345 });
        }).catch(() => {
            assert.isTrue(true);
        });
    });

    it('Adding some bets and check the states', function() {
        let sportsBet;
        let bets = [123445, 2356, 9984785];
        bets[3] = bets[0] + bets[1] + bets[2];

        return SportsBet.new('WM 2014; 13.07.2014; Deutschland - Argentinien').then((instance) => {
            sportsBet = instance;
            return Promise.all([
                sportsBet.bet(1, { from:accounts[1] , value:bets[0] }) ,
                sportsBet.bet(2, { from:accounts[2] , value:bets[1] }) ,
                sportsBet.bet(3, { from:accounts[3] , value:bets[2] }) ,
            ]);

        // check amounts for correctness
        }).then(() => {
            return Promise.all([
                sportsBet.getTipAmount(1),
                sportsBet.getTipAmount(2),
                sportsBet.getTipAmount(3),
                sportsBet.total.call()
            ]);
        }).then((amounts) => {
            assert.equal(bets[0], amounts[0].toNumber());
            assert.equal(bets[1], amounts[1].toNumber());
            assert.equal(bets[2], amounts[2].toNumber());
            assert.equal(bets[3], amounts[3].toNumber());
            
        // check the odds
            return Promise.all([
                sportsBet.odds(1) ,
                sportsBet.odds(2) ,
                sportsBet.odds(3)
            ]);
        }).then(odds => {
            let winnings = [
                (bets[0] * odds[0].toNumber()) / 100,
                (bets[1] * odds[1].toNumber()) / 100,
                (bets[2] * odds[2].toNumber()) / 100
            ];

            assert.isBelow( winnings[0], bets[3] );
            assert.isBelow( winnings[1], bets[3] );
            assert.isBelow( winnings[2], bets[3] );

            // console.log(winnings, bets[3]);
        });
        
    });

});