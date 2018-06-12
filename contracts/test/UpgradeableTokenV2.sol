pragma solidity ^0.4.23;
import "./UpgradeableTokenV1.sol";


contract UpgradeableTokenV2 is UpgradeableTokenV1 {

  event NewStateAdded(string newStateVariable);

  constructor(
    string _name,
    string _symbol,
    uint256 _granularity,
    uint256 _totalSupply,
    address _eip820RegistryAddr
  ) UpgradeableTokenV1 (
    _name, 
    _symbol, 
    _granularity, 
    _totalSupply, 
    _eip820RegistryAddr
  ) public { 
    /*Delegate constructor*/ 
  }
  function addNewState() public {
    super.addNewState();
    emit NewStateAdded("newStateVariable");
  }
  function getNewState() public view returns(string) {
    return getString(keccak256("newStateVariable"));
  }
  function funcThatV2ShouldDeprecate() public view returns(string) {
    return "V1 func of same name has been deprecated";
  }
}