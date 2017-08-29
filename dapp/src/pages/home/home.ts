import { Component, ApplicationRef } from '@angular/core';
import { ModalController, AlertController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  web3:any;
  sportsBetContractInstance:any;

  sportsBet = {
    state: -1 ,
    winningTip: 0,
    owner: '' ,
    name: '' ,
    total: 0 ,
    yourBet: {
      tip : 0 ,
      amount : 0
    } ,
    tipAmounts : [] ,
    odds : []
  };

  get state() : string {
    switch (this.sportsBet.state) {
      case 0:
        return 'Offen';
      case 1:
        return 'Gesperrt';
      case 2:
        return 'Finalisiert';
    }
  }

  constructor(
    protected modalController: ModalController,
    protected alertController: AlertController,
    protected appRef: ApplicationRef) {
  }

  continousReload() {
    this.reloadData();

    setTimeout(() => {
      this.continousReload();
    },40000);
  }

  ionViewDidEnter() {
    if (window['web3']) {      
      this.web3 = window['web3'];    
      let SportsBet = this.web3.eth.contract(this.getAbi());
      this.sportsBetContractInstance = SportsBet.at('0xbee0dd7967b85cb83edff86d21df641a09ff9bb0');
      this.continousReload();
    }
  }

  isOwner() : boolean {
    if (this.web3 && this.web3.eth.defaultAccount) {
      return this.web3.eth.defaultAccount == this.sportsBet.owner;
    } else {
      return false;
    }   
  }

  reloadData() {
    this.sportsBetContractInstance.owner.call((err, res) => { this.sportsBet.owner = res; this.appRef.tick(); });
    this.sportsBetContractInstance.game.call((err, res) => { this.sportsBet.name = res; this.appRef.tick(); });
    this.sportsBetContractInstance.winningTip.call((err, res) => { this.sportsBet.winningTip = res; this.appRef.tick(); });
    this.sportsBetContractInstance.total.call((err, res) => { this.sportsBet.total = this.web3.fromWei(res, 'ether'); this.appRef.tick(); });
    this.sportsBetContractInstance.getTipAmount(1, (err, res) => { this.sportsBet.tipAmounts[0] = this.web3.fromWei(res, 'ether'); this.appRef.tick(); });
    this.sportsBetContractInstance.getTipAmount(2, (err, res) => { this.sportsBet.tipAmounts[1] = this.web3.fromWei(res, 'ether'); this.appRef.tick(); });
    this.sportsBetContractInstance.getTipAmount(3, (err, res) => { this.sportsBet.tipAmounts[2] = this.web3.fromWei(res, 'ether'); this.appRef.tick(); });
    this.sportsBetContractInstance.odds(1, (err, res) => { this.sportsBet.odds[0] = this.web3.toDecimal(res); this.appRef.tick(); });
    this.sportsBetContractInstance.odds(2, (err, res) => { this.sportsBet.odds[1] = this.web3.toDecimal(res); this.appRef.tick(); });
    this.sportsBetContractInstance.odds(3, (err, res) => { this.sportsBet.odds[2] = this.web3.toDecimal(res); this.appRef.tick(); });
    this.sportsBetContractInstance.getBetState((err, res) => { this.sportsBet.state = this.web3.toDecimal(res); this.appRef.tick(); });
    
    setTimeout(() => {
      if (this.web3.eth.defaultAccount) {
        this.sportsBetContractInstance.getBet(this.web3.eth.defaultAccount, (err, res) => {
          this.sportsBet.yourBet.tip = this.web3.toDecimal(res[0]);
          this.sportsBet.yourBet.amount = this.web3.fromWei(res[1], 'ether');
          this.appRef.tick();
        });
      }
    },100);
  }

  lockBet() {
    this.alertController.create({
      title: 'Sportwette sperren' ,
      message: 'Wollen Sie die Wette jetzt sperren?' ,
      buttons: [
        {
          text: 'Abbrechen'
        } ,
        {
          text : 'Ja' ,
          handler: () => {
            this.sportsBetContractInstance.lockBet((err, res) => {
              if (!err) {
                this.reloadData();
              }
            });
          }
        }
      ]
    }).present();
  }

  bet() {
    let modal = this.modalController.create('bet-form');

    modal.present();

    modal.onDidDismiss((data) => {
      if (data && data.tip > 0 && data.amount > 0) {
        this.sportsBetContractInstance.bet(data.tip, { value: this.web3.toWei(data.amount, 'ether') }, (err, res) => {
          if (!err) {
            this.reloadData();
          }
        });
      }
    });
  }

  finalizeBet() {
    let alert = this.alertController.create({
      title : 'Wette abschließen'
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
      label: 'Unentschieden',
      value: '3',
      checked: false
    }).addButton('Abbrechen').addButton({
      text: 'Ja',
      handler: data => {
        this.sportsBetContractInstance.finalizeBet(data, (err, res) => {
          if (!err) {
            this.reloadData();
          }
        });
      }
    }).present();
  }

  payout() {
    this.sportsBetContractInstance.payout((err, res) => {
      if (!err) {
        this.reloadData();
      }
    });
  }

  getAbi() {
    return [
      {
        "constant": false,
        "inputs": [
          {
            "name": "_winningTip",
            "type": "uint256"
          }
        ],
        "name": "finalizeBet",
        "outputs": [],
        "payable": false,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "lockBet",
        "outputs": [],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "total",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "tip",
            "type": "uint256"
          }
        ],
        "name": "getTipAmount",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "tip",
            "type": "uint256"
          }
        ],
        "name": "odds",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "payout",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "tip",
            "type": "uint256"
          }
        ],
        "name": "bet",
        "outputs": [],
        "payable": true,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "getBetState",
        "outputs": [
          {
            "name": "",
            "type": "uint8"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "owner",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "winningTip",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "game",
        "outputs": [
          {
            "name": "",
            "type": "string"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "locked",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "_betOwner",
            "type": "address"
          }
        ],
        "name": "getBet",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          },
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "inputs": [
          {
            "name": "_game",
            "type": "string"
          }
        ],
        "payable": false,
        "type": "constructor"
      }
    ];
  }

}
