pragma solidity ^0.4.11;

import './Owned.sol';

contract SportsBet is Owned {

    struct Bet {        
        uint tip;
        uint amount;
    }
        
    // a identifier for the game to bet on
    string public game;
    
    bool public locked;
    uint public winningTip;
    uint public total;
    uint[3] amounts;

    mapping (address => Bet) bets;

    function SportsBet(string _game) {        
        game = _game;
        locked = false;
    }

    function bet(uint tip) unlocked payable {
        tip = checkTip(tip);

        // if sender already did a bet, the
        // bet can only be increased in value
        if (bets[msg.sender].tip == 0) {
            bets[msg.sender].tip = tip;
        }      
        bets[msg.sender].amount += msg.value;

        amounts[bets[msg.sender].tip-1] += msg.value;
        total += msg.value;
    }

    function payout() returns (bool) {
        // if bet is finalized and sender made a winning tip
        if (winningTip > 0 && bets[msg.sender].tip == winningTip && bets[msg.sender].amount > 0) {
            uint payout = bets[msg.sender].amount * odds(winningTip) / 100;

            // payout can only be done if there is more in the contracts balance
            if (this.balance >= payout) {
                bets[msg.sender].tip = 0;
                bets[msg.sender].amount = 0;
                msg.sender.transfer(payout);
                return true;
            }            
        }

        return false;
    }

    function lockBet() ownerOnly {
        locked = true;
    }

    function finalizeBet(uint _winningTip) ownerOnly {
        winningTip = checkTip(_winningTip);
    }

    function getBet(address _betOwner) constant returns (uint tip, uint amount) {
        return (bets[_betOwner].tip, bets[_betOwner].amount);
    }

    function getTipAmount(uint tip) constant returns (uint total) {
        tip = checkTip(tip);
        return amounts[tip-1];
    }

    function odds(uint tip) constant returns(uint) {
        tip = checkTip(tip);
        return (total * 100) / (amounts[tip-1]);
    }

    /**
        Prevent invalid tips, only 1, 2, 3 is allowed

        @param tip tip to be checked
        @return a valid tip
    */
    function checkTip(uint tip) internal returns (uint) {
        if (tip < 1) {
            tip = 1;
        } else if (tip > 3) {
            tip = 3;
        }

        return tip;
    }

    modifier unlocked() {
        require(!locked);
        _;
    }

}

