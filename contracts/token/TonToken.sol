pragma solidity ^0.4.23;
import "./EternalStorageTokenBase.sol";

// to be deprecated
contract TonToken is EternalStorageTokenBase {

  constructor(
    string _name,
    string _symbol,
    uint256 _granularity,
    uint256 _totalSupply,
    address _eip820RegistryAddr
  ) public EternalStorageTokenBase(
    _name,
    _symbol, 
    _granularity, 
    _totalSupply, 
    _eip820RegistryAddr
  ) {
    //Delegate constructor
  }
}