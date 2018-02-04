import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController } from 'ionic-angular';
import { SportsBettingService } from '../../services/index';

@IonicPage({
    name : 'bet-overview'
})
@Component({
    selector: 'page-bet-overview',
    templateUrl: 'bet-overview.html',
})
export class BetOverviewPage {

    public startIndex:number = 0;
    public betsMaxIndex:number = 0;
    public betsCount:number = 0;
    public bets:any[] = [];

    constructor(protected modalController:ModalController, protected navController:NavController, protected sportsBettingService:SportsBettingService) {}

    openCreateModal() {
        let modal = this.modalController.create('bet-create-form');
        modal.present();
    }

    openBet(address:string) {
        this.navController.push('bet-detail', {
            address : address
        });
    }

    ionViewDidLoad() {

        this.sportsBettingService.ready(() => {
            this.sportsBettingService.getBetCount().then(count => {
                this.betsCount = count;
                this.betsMaxIndex = count > 5 ? 4 : (count-1);

                let promises = [];
                for (let i = this.startIndex; i <= this.betsMaxIndex; i++) {
                    promises.push(this.sportsBettingService.getBetByIndex(i));
                }
                return Promise.all(promises);
            }).then(bets => {
                let promises = [];
                for(let bet of bets) {
                    promises.push(this.sportsBettingService.getBetData(bet, [{ name : 'game'}, { name : 'endOfBetting', format : (input) => { return new Date(input.toNumber() * 1000); } }]));
                }
                return Promise.all(promises);
            }).then(betsData => {
                for(let data of betsData) {
                    this.bets.push(data);
                }
            });
        });
    }

}
