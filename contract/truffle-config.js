module.exports = {
  networks : {
    testrpc : {
        host: "127.0.0.1" ,
        port: 8545 ,
        network_id : "*"
    } ,
    development : {
      host: "127.0.0.1" ,
      port: 7545 ,
      network_id : "*"
    } ,
    ropsten : {
      gas: 2900000 ,
      provider : function() {
        var HDWalletProvider = require("truffle-hdwallet-provider");
        var mnemonic = require("./secret").ropsten.mnemonic;
        var infura = require("./secret").ropsten.infura;

        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/" + infura);
      } ,
      network_id : 3
    }
  }
};
