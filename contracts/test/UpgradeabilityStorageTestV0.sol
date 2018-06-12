pragma solidity ^0.4.23;


// this is a contract used to test UpgradeabilityStorageTest functions
contract UpgradeabilityStorageTestV0 {

  function testProxyCall() pure public returns(string) {
    return "test successful";
  }
}