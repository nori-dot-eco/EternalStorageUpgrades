pragma solidity ^0.4.22;

/**
 * @title EternalStorage
 * @dev A contract that can be used as a storage where the variables
 * are stored in a set of mappings indexed by hash names.
 */
 //todo jaycen sanity check setters for correct input types
contract EternalStorage {
  
  struct Storage {
    mapping(bytes32 => bool) _bool;
    mapping(bytes32 => int) _int;
    mapping(bytes32 => uint256) _uint;
    mapping(bytes32 => string) _string;
    mapping(bytes32 => address) _address;
    mapping(bytes32 => bytes) _bytes;
  }

  Storage internal _storage;

  /**
  * @dev The constructor sets the original `owner` of the
  * contract to the sender account.
  */
  constructor() public {
    _storage._address[keccak256("owner")] = address(this);
  }

  /**
  * @dev Allows the owner to set a value for a boolean variable.
  * @param h The keccak256 hash of the variable name
  * @param v The value to be stored
  */
  function _setBoolean(bytes32 h, bool v) internal {
    _storage._bool[h] = v;
  }

  /**
  * @dev Allows the owner to set a value for a int variable.
  * @param h The keccak256 hash of the variable name
  * @param v The value to be stored
  */
  function _setInt(bytes32 h, int v) internal {
    _storage._int[h] = v;
  }

  /**
  * @dev Allows the owner to set a value for a boolean variable.
  * @param h The keccak256 hash of the variable name
  * @param v The value to be stored
  */
  function _setUint(bytes32 h, uint256 v) internal {
    _storage._uint[h] = v;
  }

  /**
  * @dev Allows the owner to set a value for a address variable.
  * @param h The keccak256 hash of the variable name
  * @param v The value to be stored
  */
  function _setAddress(bytes32 h, address v) internal {
    _storage._address[h] = v;
  }

  /**
  * @dev Allows the owner to set a value for a string variable.
  * @param h The keccak256 hash of the variable name
  * @param v The value to be stored
  */
  function _setString(bytes32 h, string v) internal {
    _storage._string[h] = v;
  }

  /**
  * @dev Allows the owner to set a value for a bytes variable.
  * @param h The keccak256 hash of the variable name
  * @param v The value to be stored
  */
  function _setBytes(bytes32 h, bytes v) internal {
    _storage._bytes[h] = v;
  }

  /**
  * @dev Get the value stored of a boolean variable by the hash name
  * @param h The keccak256 hash of the variable name
  */
  function getBoolean(bytes32 h) public view returns (bool){
    return _storage._bool[h];
  }

  /**
  * @dev Get the value stored of a int variable by the hash name
  * @param h The keccak256 hash of the variable name
  */
  function getInt(bytes32 h) public view returns (int){
    return _storage._int[h];
  }

  /**
  * @dev Get the value stored of a uint variable by the hash name
  * @param h The keccak256 hash of the variable name
  */
  function getUint(bytes32 h) public view returns (uint256){
    return _storage._uint[h];
  }

  /**
  * @dev Get the value stored of a address variable by the hash name
  * @param h The keccak256 hash of the variable name
  */
  function getAddress(bytes32 h) public view returns (address){
    return _storage._address[h];
  }

  /**
  * @dev Get the value stored of a string variable by the hash name
  * @param h The keccak256 hash of the variable name
  */
  function getString(bytes32 h) public view returns (string){
    return _storage._string[h];
  }

  /**
  * @dev Get the value stored of a bytes variable by the hash name
  * @param h The keccak256 hash of the variable name
  */
  function getBytes(bytes32 h) public view returns (bytes){
    return _storage._bytes[h];
  }

}