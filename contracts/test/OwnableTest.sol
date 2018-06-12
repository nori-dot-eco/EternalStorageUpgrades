pragma solidity ^0.4.23;

import "../Ownable.sol";


/**
 * @title Ownable
 * @dev This contract is used for testing the Ownable contract
 */
contract OwnableTest is Ownable {
  constructor() public {
    setOwner(msg.sender);
  }
}