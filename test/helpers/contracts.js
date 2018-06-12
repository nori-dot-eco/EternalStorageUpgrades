import { encodeCall } from '../helpers/utils';
import { UnstructuredOwnedUpgradeabilityProxy } from '../helpers/artifacts';
const { promisify } = require('util');
const TonToken = artifacts.require('TonToken');

function getLogs(Event, filter, additionalFilters) {
  const query = Event(filter, additionalFilters);
  return promisify(query.get.bind(query))();
}

const repeat = (func, times) => {
  for (let i = 0; i < times; i++) {
    func();
  }
};

const deployContract = (
  contract,
  [...constructorParams],
  { ...deployParams }
) => contract.new(...constructorParams, { ...deployParams });
// todo deprecate this after prs for upgrading
const deployToken = (name, symbol, granularity, totalSupply, eip820RegAddr) =>
  TonToken.new(name, symbol, granularity, totalSupply, eip820RegAddr);

// deploy an unstructured upgradeable contract and proxy, initialize the contract,
// then create a contract at the proxy's address.
const deployUpgradeableContract = async (
  passedProxy = null,
  contract,
  initializeParams,
  [...constructorParams],
  { ...deployParams }
) => {
  // use a proxy already existing in the testrpc or deploy a new one (useful for testing multi upgrade scenarios)
  const proxy =
    passedProxy === null
      ? await deployContract(UnstructuredOwnedUpgradeabilityProxy, [], {
          ...deployParams,
        })
      : passedProxy;

  const contractToMakeUpgradeable = await deployContract(
    contract,
    ...constructorParams,
    { ...deployParams }
  );

  if (initializeParams !== null) {
    const initializeData = encodeCall(
      'initialize',
      initializeParams[0], // ex: ['string', 'string', 'uint', 'uint', 'address', 'address'],
      initializeParams[1] // ex: ['Upgradeable NORI Token', 'NORI', 1, 0, eip820Registry.address, admin]
    );
    await proxy.upgradeToAndCall(
      contractToMakeUpgradeable.address,
      initializeData,
      {
        ...deployParams,
      }
    );
  } else {
    await proxy.upgradeTo(contractToMakeUpgradeable.address, {
      ...deployParams,
    });
  }

  const upgradeableContractV0 = await contract.at(proxy.address, {
    ...deployParams,
  });
  return [contractToMakeUpgradeable, upgradeableContractV0, proxy];
};

module.exports = {
  deployUpgradeableContract,
  getLogs,
  deployToken,
  repeat,
  deployContract,
};
