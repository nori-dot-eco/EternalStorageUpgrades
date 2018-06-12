pragma solidity ^0.4.23;


// this is a contract used to test UpgradeabilityStorageTest second version functions
contract UpgradeabilityStorageTestV1 {
  function testProxyCall() pure public returns(string) {
    return "test V1 successful";
  }
}