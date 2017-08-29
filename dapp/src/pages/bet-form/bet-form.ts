import { Component } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';

@IonicPage({
  name : 'bet-form'
})
@Component({
  templateUrl: 'bet-form.html',
})
export class BetFormPage {

  tip:any;
  amount:number;

  constructor(public viewController: ViewController) {
  }

  ionViewDidLoad() {
  }

  close() {
    this.viewController.dismiss({
      tip    : this.tip ,
      amount : this.amount
    });
  }

}
