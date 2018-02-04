import { Component } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';
import { SportsBettingService } from '../../services/index';

@IonicPage({
    name : 'bet-create-form'
})
@Component({
    selector: 'page-bet-create-form',
    templateUrl: 'bet-create-form.html',
})
export class BetCreateFormPage {

    name:string;
    date:string;

    save() {
        var timestamp = Math.floor((new Date(this.date)).getTime() / 1000);

        this.sportsBettingService.createBet(this.name, timestamp).then(() => {
            this.viewController.dismiss();
        }).catch(() => {
            this.viewController.dismiss();
        });
    }

    constructor(protected viewController:ViewController, protected sportsBettingService:SportsBettingService) {
        this.date = (new Date()).toISOString();
    }

}
