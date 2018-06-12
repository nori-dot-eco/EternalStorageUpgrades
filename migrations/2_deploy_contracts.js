/* globals artifacts */
const EIP820Registry = artifacts.require('./EIP820Registry.sol');

module.exports = (deployer, network, accounts) => {
  deployer.then(async () => {
    await deployer.deploy(EIP820Registry);
  });
};
