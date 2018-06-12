const OwnableTest = artifacts.require('OwnableTest');
const UpgradeableTokenV1 = artifacts.require('UpgradeableTokenV1');
const UpgradeableTokenV0 = artifacts.require('UpgradeableTokenV0');
const UpgradeableTokenV2 = artifacts.require('UpgradeableTokenV2');
const UpgradeableTokenV3 = artifacts.require('UpgradeableTokenV3');
const TonToken = artifacts.require('./TonToken.sol');
const EternalStorage = artifacts.require('./EternalStorage.sol');
const EternalStorageTest = artifacts.require('./EternalStorageTest.sol');
const UpgradeabilityProxy = artifacts.require('./UpgradeabilityProxy.sol');
const EIP820Registry = artifacts.require('./EIP820Registry.sol');
const Proxy = artifacts.require('./Proxy.sol');
const UpgradeabilityStorageTestV0 = artifacts.require(
  './UpgradeabilityStorageTestV0.sol'
);
const UpgradeabilityStorageTestV1 = artifacts.require(
  './UpgradeabilityStorageTestV1.sol'
);
const UpgradeabilityStorageTestV2 = artifacts.require(
  './UpgradeabilityStorageTestV2.sol'
);
const UpgradeabilityOwnerStorage = artifacts.require(
  './UpgradeabilityOwnerStorage.sol'
);
const OwnedUpgradeabilityProxy = artifacts.require(
  './OwnedUpgradeabilityProxy.sol'
);
const UpgradeabilityStorage = artifacts.require('./UpgradeabilityStorage.sol');
const EternalStorageProxy = artifacts.require('./EternalStorageProxy.sol');
const EternalStorageProxyTest = artifacts.require(
  './EternalStorageProxyTest.sol'
);
module.exports = {
  UpgradeableTokenV0,
  EIP820Registry,
  UpgradeableTokenV1,
  UpgradeableTokenV2,
  UpgradeableTokenV3,
  EternalStorageProxy,
  EternalStorageProxyTest,
  Proxy,
  UpgradeabilityStorage,
  OwnedUpgradeabilityProxy,
  UpgradeabilityStorageTestV0,
  UpgradeabilityStorageTestV1,
  UpgradeabilityStorageTestV2,
  UpgradeabilityProxy,
  UpgradeabilityOwnerStorage,
  EternalStorage,
  OwnableTest,
  TonToken,
  EternalStorageTest,
};
