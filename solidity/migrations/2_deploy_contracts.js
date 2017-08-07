var SportsBet = artifacts.require("./SportsBet.sol");

module.exports = function(deployer) {
  deployer.deploy(SportsBet, 'WM 2014; 13.07.2014; Deutschland - Argentinien');
};
