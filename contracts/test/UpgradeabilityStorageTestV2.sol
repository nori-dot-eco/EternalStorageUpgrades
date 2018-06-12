pragma solidity ^0.4.23;
import "./UpgradeabilityStorageTestV1.sol";


// this is a contract used to test UpgradeabilityStorageTest second version functions
contract UpgradeabilityStorageTestV2 is UpgradeabilityStorageTestV1 {

  function anotherTestProxyCall() pure public returns(string) {
    return "You can call the new function!";
  }
}