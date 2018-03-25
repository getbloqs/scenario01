# Scenario 01 - Sports Bet

## Smart contracts

The sports bet contract is found inside the `contract` directory. The project requires the installation of [truffle](http://truffleframework.com/) to handle development operations.

Truffle can be installed as a global npm package:
```
npm i -g truffle
```

For installing all the project dependencies `npm i` needs to be triggered inside the `contract` directory. The smart contracts can be compiled via the truffle command `truffle compile`. The result of the compilation can be found inside the `build` directory.

## Web Application

The web application for the managing the bets is inside the `app` directory. The application is build with [Ionic](https://ionicframework.com/). Therefore the ionic cli is required.

The ionic cli can be installed as a global npm package:
```
npm i -g ionic
```

For installing all the project dependencies `npm i` needs to be triggered inside the `app` directory. The project can be built for deployment via the `npm run build` command. The result is available inside the `www` directory. For a local development version of the web application `ionic serve` will fire up a webserver at [localhost:8100](http://localhost:8100).

## Local development

For local development a local Ethereum blockchain is required. The most straightforward approach is to use [Ganache](http://truffleframework.com/ganache/). Ganache has a user interface and is easy to setup.

In the following the steps are described how to setup a local version of the ICO demonstration scenario:

 - Startup Ganache to have a local Ethereum blockchain at disposal. The RPC interface will be available on `http://127.0.0.1:7545`.
 - Migrate the smart contracts on the local Ethereum blockchain. Therefore the `truffle migrate --reset` command needs to be executed inside the `contract` directory.
 - Inside the `app` directory a development webserver can be brought up by executing the `ionic serve` command. On `http://localhost:8100` the app should be available for testing.
 - For interacting with the app locally inside your browser [MetaMask](https://metamask.io/) needs to be available and a custom provider for `http://127.0.0.1:7545` needs to be created. 

## Testnet Deployment

For deploying the smart contract on the `ropsten` ethereum testnet the following steps are required:

 - A `secret.json` file needs to be created inside the `contract` directory
 - Inside the `contract` directory the command `truffle migrate --reset --network ropsten` would deploy the contract on the ropsten network. Be aware that a private key with some amount of (testnet) ether is required.

## `secret.json` file format

The `mnemonic` are the secret words of the private key. For `infura` enter the api key from the infura registration.

```
{
    ropsten : {
        "mnemonic" : "..." ,
        "infura" : "..."
    }
}
```