import { Component } from '@angular/core';
import { IonicPage, NavParams, ModalController, AlertController } from 'ionic-angular';
import { SportsBettingService } from '../../services/index';

@IonicPage({
    name : 'bet-detail' ,
    segment : 'bet-detail/:address' ,
    defaultHistory: ['bet-overview']
})
@Component({
    selector: 'page-bet-detail',
    templateUrl: 'bet-detail.html',
})
export class BetDetailPage {

    betContract:any;

    bet = {
        game : '' ,
        total : 0 ,
        address : '' ,
        owner : '' ,
        winningTip : 0 ,
        endOfBetting : new Date() ,
        tipAmounts : [0,0,0] ,
        odds : [0,0,0]
    };

    yourBet = {
        tip : 3 ,
        amount : 1000
    };

    constructor(public navParams: NavParams, protected modalController:ModalController, protected alertController:AlertController, protected sportsBettingService:SportsBettingService) {
        this.bet.address = navParams.get('address');
    }

    isFinalized() : boolean {
        return this.bet.winningTip > 0;
    }

    canBet() : boolean {
        return this.bet.endOfBetting.getTime() > (new Date()).getTime();
    }

    loadData() {
        this.sportsBettingService.getBetData(this.betContract, [{
            name : 'game'
        }, {
            name : 'endOfBetting' ,
            format : (input) => { return new Date(input.toNumber() * 1000); }
        }, {
            name : 'total',
            format : (input) => { return this.sportsBettingService.web3.fromWei(input, 'ether'); }
        }, {
            name : 'winningTip'
        }, {
            name : 'owner'
        }]).then(data => {
            for (let key in data) {
                this.bet[key] = data[key];
            }
            return this.sportsBettingService.getOdds(this.betContract);
        }).then(odds => {
            this.bet.odds = odds;
            return this.sportsBettingService.getAmounts(this.betContract);
        }).then(amounts => {
            this.bet.tipAmounts = amounts;
            return this.sportsBettingService.retrieveBet(this.betContract);
        }).then(yourBet => {
            this.yourBet = yourBet;
        }).catch(err => {
            console.error(err);
        });
    }

    ionViewWillEnter() {
        this.sportsBettingService.getBetAt(this.bet.address).then((betContract) => {
            this.betContract = betContract;
            this.loadData();
        });
    }

    takeABet() {
        let modal = this.modalController.create('bet-form');

        modal.present();

        modal.onDidDismiss((data) => {
            if (data && data.tip > 0 && data.amount > 0) {
                this.sportsBettingService.bet(this.betContract, data.tip, data.amount).then(() => {
                    this.loadData();
                });
            }
        });
    }

    finalizeBet() {
        let alert = this.alertController.create({
            title : 'Finalize bet?'
        });

        alert.addInput({
            type: 'radio',
            label: 'Team 1',
            value: '1',
            checked: false
        }).addInput({
            type: 'radio',
            label: 'Team 2',
            value: '2',
            checked: false
        }).addInput({
            type: 'radio',
            label: 'Draw',
            value: '3',
            checked: false
        }).addButton('Abort').addButton({
            text: 'Finalize',
            handler: data => {
                this.sportsBettingService.finalizeBet(this.betContract, data).then(() => {
                    this.loadData();
                }).catch((err) => {
                    console.error(err);
                });
            }
        }).present();
    }

    payout() {
        this.sportsBettingService.payout(this.betContract)
            .then(() => {
                this.loadData();
            }).catch(() => {
                let alert = this.alertController.create({
                    title : 'Problem with payout' ,
                    message : 'There was a problem with your payout, please try again.'
                });
                alert.addButton('Ok').present();
            });
    }

    isOwner() {
        return this.sportsBettingService.isOwner(this.bet.owner);
    }

}
