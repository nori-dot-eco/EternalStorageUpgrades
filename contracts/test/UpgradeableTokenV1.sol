pragma solidity ^0.4.23;
import "./UpgradeableTokenV0.sol";


contract UpgradeableTokenV1 is UpgradeableTokenV0 {

  constructor(
    string _name,
    string _symbol,
    uint256 _granularity,
    uint256 _totalSupply,
    address _eip820RegistryAddr
  ) UpgradeableTokenV0 (
    _name, 
    _symbol, 
    _granularity, 
    _totalSupply, 
    _eip820RegistryAddr
  ) public { 
    /*Delegate constructor*/ 
  }
  function addNewState() public {
    _setString(keccak256("newStateVariable"), "new state");
  }
  function getNewState() public view returns(string) {
    return getString(keccak256("newStateVariable"));
  }
  function funcThatV2ShouldDeprecate() public view returns(string) {
    return "I will not be callable in V2";
  }
}