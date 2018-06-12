pragma solidity ^0.4.23;
import "../EternalStorageProxy.sol";

// this is a contract used to test eternal storage internal functions of EternalStorageProxy
contract EternalStorageProxyTest is EternalStorageProxy {
  /**
  * @dev Allows the owner to set a value for a boolean variable.
  * @param h The keccak256 hash of the variable name
  * @param v The value to be stored
  */
  function setBoolean(bytes32 h, bool v) public {
    _setBoolean(h,v);
  }

  /**
  * @dev Allows the owner to set a value for a int variable.
  * @param h The keccak256 hash of the variable name
  * @param v The value to be stored
  */
  function setInt(bytes32 h, int v) public {
    _setInt(h,v);
  }

  /**
  * @dev Allows the owner to set a value for a boolean variable.
  * @param h The keccak256 hash of the variable name
  * @param v The value to be stored
  */
  function setUint(bytes32 h, uint256 v) public {
    _setUint(h,v);
  }

  /**
  * @dev Allows the owner to set a value for a address variable.
  * @param h The keccak256 hash of the variable name
  * @param v The value to be stored
  */
  function setAddress(bytes32 h, address v) public {
    _setAddress(h,v);
  }

  /**
  * @dev Allows the owner to set a value for a string variable.
  * @param h The keccak256 hash of the variable name
  * @param v The value to be stored
  */
  function setString(bytes32 h, string v) public {
    _setString(h,v);
  }

  /**
  * @dev Allows the owner to set a value for a bytes variable.
  * @param h The keccak256 hash of the variable name
  * @param v The value to be stored
  */
  function setBytes(bytes32 h, bytes v) public {
    _setBytes(h,v);
  }
}