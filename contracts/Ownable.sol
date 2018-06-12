pragma solidity ^0.4.22;

import "./EternalStorage.sol";

// todo jaycen this should replace Owned.sol when upgrade PRs are finished
/**
 * @title Ownable
 * @dev This contract has an owner address providing basic authorization control
 */
contract Ownable is EternalStorage {
  /**
   * @dev Event to show ownership has been transferred
   * @param previousOwner representing the address of the previous owner
   * @param newOwner representing the address of the new owner
   */
  event OwnershipTransferred(address previousOwner, address newOwner);

  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOwner() {
    require(msg.sender == getOwner());
    _;
  }

  /**
   * @dev Tells the address of the owner
   * @return the address of the owner
   */
  function getOwner() public view returns (address) {
    return getAddress(keccak256("owner"));
  }

  /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner.
   * @param newOwner the address to transfer ownership to.
   */
  function transferOwnership(address newOwner) public onlyOwner {
    require(newOwner != address(0));
    setOwner(newOwner);
  }

  //todo jaycen does making this internal mean we don't need onlyOwner modifer?
  /**
   * @dev Sets a new owner address
   */
  function setOwner(address newOwner) internal {
    emit OwnershipTransferred(getOwner(), newOwner);
    _setAddress(keccak256("owner"), newOwner);
  }
}