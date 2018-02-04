const fs = require('fs');
const SportsBetFactory = artifacts.require("SportsBetFactory");

var infura = '';
if (fs.existsSync(__dirname + '/../secret.json')) {
  infura = require(__dirname + '/../secret.json').infura;
}

const deploy = (deployer) => {
    return deployer.deploy(SportsBetFactory);
};

const updateConfig = (contract, uri) => {
  var pathToDevConfig1 = __dirname + '/../../app/contract.config.json';
  var stream1 = fs.createWriteStream(pathToDevConfig1);

  stream1.write(JSON.stringify({
    'contract' : contract
  }));
  stream1.end();
}; 

module.exports = function(deployer, network) {  
  deploy(deployer).then(() => {
    return SportsBetFactory.deployed();
  }).then((instance) => {
    if (network == 'development') {
      updateConfig(instance.address, 'http://127.0.0.1:7545');
    } else if (network == 'ropsten') {
      updateConfig(instance.address, "https://ropsten.infura.io/" + infura);
    }    
  });  
};
