import { ConfigService } from './config-service';
declare var web3;
declare var Web3;

export class SportsBettingService {

    public web3:any;
    protected contract:any;
    protected sportsBetFactory:any;
    protected isReady = false;
    protected readyCallback:any;

    constructor(protected configService:ConfigService) {
        if (typeof web3 !== 'undefined') {
            this.web3 = new Web3(web3.currentProvider);

            this.configService.getConfig().then(config => {
                this.contract = config.contract;
                return this.configService.getAbi('SportsBetFactory');
            }).then((abi) => {
                this.sportsBetFactory = this.web3.eth.contract(abi).at(this.contract);
                this.isReady = true;

                if (this.readyCallback) {
                    this.readyCallback();
                }
            });
        }
    }

    ready(callback:any) {
        if (this.isReady) {
            callback();
        } else {
            this.readyCallback = callback;
        }
    }

    getBetAt(address:string) : Promise<any> {
        return new Promise<any> ((resolve, reject) => {
            this.configService.getAbi('SportsBet').then(abi => {
                resolve(this.web3.eth.contract(abi).at(address));
            });
        });
    }

    createBet(name:string, timestamp:number) {
        return new Promise<void> ((resolve, reject) => {
            this.sportsBetFactory.createSportsBet(name, this.web3.toBigNumber(timestamp), (err, res) => {
                if (!err) {
                    resolve();
                } else {
                    reject();
                }
            });
        });
    }

    getBetAddressByIndex(betIndex:number) : Promise<string> {
        return new Promise<string> ((resolve, reject) => {
            this.sportsBetFactory.getBet(betIndex, (err, res) => {
                if (!err) {
                    resolve(res[1]);
                } else {
                    reject();
                }
            });
        });
    }

    getBetByIndex(betIndex) : Promise<any> {
        return new Promise<any> ((resolve, reject) => {
            this.getBetAddressByIndex(betIndex).then(address => {
                resolve(this.getBetAt(address));
            })
        });
    }

    getBetCount() {
        return new Promise<number>((resolve, reject) => {
            this.sportsBetFactory.betCount.call((err, res) => {
                if (!err) {
                    resolve(res.toNumber());
                } else {
                    reject();
                }
            });
        });
    }

    getBetAttribute(bet:any, attr:string, format:any = null) : Promise<any> {
        return new Promise<any>((resolve, reject) => {
            bet[attr].call((err, res) => {
                if (!err) {
                    if (format) {
                        resolve([attr, format(res)]);
                    } else {
                        resolve([attr, res]);
                    }
                } else {
                    reject(err);
                }
            });
        });
    }

    getBetData(bet:any, attributes:any[]) : Promise<any> {
        return new Promise<any> ((resolve, reject) => {

            let promises = [];
            for (let attr of attributes) {
                promises.push(this.getBetAttribute(bet, attr.name, attr.format));
            }

            Promise.all(promises).then(resArray => {
                let result:any = {
                    address : bet.address
                };

                for (let res of resArray) {
                    result[res[0]] = res[1];
                }

                resolve(result);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    bet(bet:any, tip:number, amount:number) : Promise<any> {
        return new Promise<any> ((resolve, reject) => {
            bet.bet(tip, { value: this.web3.toWei(amount, 'ether') }, (err, res) => {
                if (!err) {
                    resolve();
                } else {
                    reject();
                }
            });
        });
    }

    payout(bet:any) : Promise<any> {
        return new Promise<any> ((resolve, reject) => {
            bet.payout({ gas: 200000 }, (err, res) => {
                if (!err) {
                    resolve();
                } else {
                    reject(err);
                }
            })
        });
    }

    getOdds(bet:any) : Promise<number[]> {
        return new Promise<number[]>((resolve, reject) => {
            let promises = [];

            for (let i = 1; i <= 3; i++) {
                promises.push(this.getOdd(bet, i));
            }

            Promise.all(promises).then(results => {
                resolve(results);
            });
        });
    }

    getOdd(bet:any, index:number) : Promise<number> {
        return new Promise<number> ((resolve, reject) => {
            bet.calculateOdds(index, (err, res) => {
                if (!err) {
                    resolve( res.toNumber() ) ;
                } else {
                    resolve(0);
                }
            });
        });
    }

    getAmounts(bet:any) : Promise<number[]> {
        return new Promise<number[]>((resolve, reject) => {
            let promises = [];

            for (let i = 0; i < 3; i++) {
                promises.push(this.getAmount(bet, i));
            }

            Promise.all(promises).then(results => {
                resolve(results);
            });
        });
    }

    getAmount(bet:any, index:number) : Promise<number> {
        return new Promise<number> ((resolve, reject) => {
            bet.amounts.call(index, (err, res) => {
                if (!err) {
                    resolve( (this.web3.fromWei(res, 'ether')).toNumber() ) ;
                } else {
                    reject(err);
                }
            });
        });
    }

    isOwner(address:string) : boolean {
        if (this.web3 && this.web3.eth.defaultAccount) {
            return this.web3.eth.defaultAccount == address;
        } else {
            return false;
        }
    }

    finalizeBet(bet:any, winningTip:number) : Promise<void> {
        return new Promise<void> ((resolve, reject) => {
            bet.finalizeBet(winningTip, (err, res) => {
                if (!err) {
                    resolve();
                } else {
                    reject();
                }
            });
        });
    }

    retrieveBet(bet:any, owner:string = null) : Promise<any> {
        return new Promise<any> ((resolve, reject) => {
            if (!owner) {
                owner = this.web3.eth.defaultAccount;
            }

            Promise.all([
                this.retrieveBetTip(bet, owner) ,
                this.retriveBetAmount(bet, owner)
            ]).then(results => {
                resolve({
                    tip : results[0], amount : results[1]
                });
            }).catch((err) => {
                console.error(err);
                resolve({
                    tip : 0, amount : 0
                });
            });
        });
    }

    retrieveBetTip(bet:any, owner:string) : Promise<any> {
        return new Promise<any> ((resolve, reject) => {
            bet.betTips(owner, (err, res) => {
                if (!err) {
                    resolve( res.toNumber() );
                } else {
                    reject(err);
                }
            });
        });
    }

    retriveBetAmount(bet:any, owner:string) : Promise<any> {
        return new Promise<any> ((resolve, reject) => {
            bet.betAmounts(owner, (err, res) => {
                if (!err) {
                    resolve( (this.web3.fromWei(res, 'ether')).toNumber() );
                } else {
                    reject(err);
                }
            });
        });
    }

    getCurrentAccount() : string {
        return this.web3.eth.defaultAccount;
    }

}
