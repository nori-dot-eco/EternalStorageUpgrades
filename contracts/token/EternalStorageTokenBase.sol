pragma solidity ^0.4.23;

import "./IEIP777.sol";
import "./IEIP777TokensRecipient.sol";
import "./IEIP777TokensSender.sol";
import "./IEIP777TokensOperator.sol";
import "./Ierc20.sol";
import "./DEPRECATEDEIP820Implementer.sol";
import "../../node_modules/zeppelin-solidity/contracts/math/SafeMath.sol";
import "../EternalStorage.sol";
import "../Ownable.sol";

// Note: this deprecates basic777
contract EternalStorageTokenBase is Ierc20, IEIP777, DEPRECATEDEIP820Implementer, Ownable {

  using SafeMath for uint256;

  ///  @notice This modifier is applied to erc20 obsolete methods that are
  ///  implemented only to maintain backwards compatibility. When the erc20
  ///  compatibility is disabled, this methods will fail.
  modifier erc20 () {
    require(getBoolean(keccak256("mErc20compatible")), "ERC20 compatibility now enabled");
    _;
  }
  
  /// @dev IMPORTANT: when initializing an upgradeable token using this base contract
  /// the developershould call init() directly after constructing to initialize the parameters.
  /// This is neccesary due to the way EternalStorageProxy initializes storage variables after
  /// using token.at(EternalStorageProxy.address)
  constructor(
    string _name,
    string _symbol,
    uint256 _granularity,
    uint256 _totalSupply,
    address _eip820RegistryAddr
  ) DEPRECATEDEIP820Implementer(_eip820RegistryAddr) public {
    //todo
    // unfortunately due to the way eternal storage works, if you init the constructor's variables here, then as soon as you deploy the 
    // storage proxy it makes all the variables moot. Leaving this init here so it doesn't break tests. Should be fixed if a more elegant solution
    // cant be found
    init(
      _name,
      _symbol, 
      _granularity, 
      _totalSupply, 
      _eip820RegistryAddr
    );
  }

  //todo only owner
  //required because of how storage gets init after using proxy
  function init(
    string _name,
    string _symbol,
    uint256 _granularity,
    uint256 _totalSupply,
    address _eip820RegistryAddr
  ) public {
    
    require(_granularity >= 1, "Invalid token granularity");
    //todo jaycen: remove the following, when it is be replaced with eternalStorageProxy (future PR)
    setOwner(msg.sender);
    _setUint(keccak256("mGranularity"), _granularity);
    _setString(keccak256("mName"), _name);
    _setString(keccak256("mSymbol"), _symbol);
    _setUint(keccak256("mTotalSupply"), _totalSupply);
    _setBoolean(keccak256("mErc20compatible"), true);
    
    //todo jaycen use latest erc820 standard for I naming (for the below)
    setIntrospectionRegistry(_eip820RegistryAddr);
    setInterfaceImplementation("IEIP777", this);
    setInterfaceImplementation("Ierc20", this);

  }

  /// @return the name of the token
  function name() public view returns (string) { return getString(keccak256("mName")); }

  /// @return the symbol of the token
  function symbol() public view returns(string) { return getString(keccak256("mSymbol")); }

  /// @return the granularity of the token
  function granularity() public view returns(uint256) { return getUint(keccak256("mGranularity")); }

  /// @return the total supply of the token
  function totalSupply() public view returns(uint256) { return getUint(keccak256("mTotalSupply")); }

  /// @notice For Backwards compatibility
  /// @return The decimls of the token. Forced to 18 in ERC777.
  function decimals() public erc20 view returns (uint8) { return uint8(18); }

  /// @notice Return the account balance of some account
  /// @param _tokenHolder Address for which the balance is returned
  /// @return the balance of `_tokenAddress`.
  function balanceOf(address _tokenHolder) public view returns (uint256) {
    return getUint(keccak256("mBalances", _tokenHolder));
  }

  /// @notice Disables the ERC-20 interface. This function can only be called
  ///  by the owner.
  //todo jaycen onlyProxyOwner modifier once finished with prs
  function disableERC20() public onlyOwner {
    _setBoolean(keccak256("mErc20compatible"), false);
    setInterfaceImplementation("Ierc20", 0x0);
  }

  /// @notice Re enables the ERC-20 interface. This function can only be called
  ///  by the owner.
  //todo jaycen onlyProxyOwner modifier once finished with prs
  function enableERC20() public onlyOwner {
    _setBoolean(keccak256("mErc20compatible"), true);
    setInterfaceImplementation("Ierc20", this);
  }

  //todo DANGER do we REALLY want to have mutable storage?
  // function setStorage(address es) public {
  //   if (es != address(store)){
  //     store = EternalStorage(es);
  //   }
  // }

  //todo onlyowner
  function setIntrospectionRegistry(address _eip820RegistryAddr) public {
    eip820Registry = IEIP820Registry(_eip820RegistryAddr);
  }

  /// @notice ERC20 backwards compatible transfer.
  /// @param _to The address of the recipient
  /// @param _value The amount of tokens to be transferred
  /// @return `true`, if the transfer can't be done, it should fail.
  function transfer(address _to, uint256 _value) public erc20 returns (bool success) {
    doSend(
      msg.sender,
      _to,
      _value,
      "",
      msg.sender,
      "",
      false
    );

    return true;
  }

  /// @notice ERC20 backwards compatible transferFrom.
  /// @param _from The address holding the tokens being transferred
  /// @param _to The address of the recipient
  /// @param _value The amount of tokens to be transferred
  /// @return `true`, if the transfer can't be done, it should fail.
  function transferFrom(address _from, address _to, uint256 _value) public erc20 returns (bool success) {
    require(_value <=  getUint(keccak256("mAllowed", _from, msg.sender)), "Sender balance or allowance invalid");

    // Cannot be after doSend because of tokensReceived re-entry
    _setUint(keccak256("mAllowed", _from, msg.sender), getUint(keccak256("mAllowed", _from, msg.sender)).sub(_value));
    
    doSend(
      _from, 
      _to, 
      _value, 
      "", 
      msg.sender, 
      "", 
      false
    );

    return true;
  }

  /// @notice ERC20 backwards compatible approve.
  ///  `msg.sender` approves `_spender` to spend `_value` tokens on its behalf.
  /// @param _spender The address of the account able to transfer the tokens
  /// @param _value The amount of tokens to be approved for transfer
  /// @return `true`, if the approve can't be done, it should fail.
  function approve(address _spender, uint256 _value) public erc20 returns (bool success) {
    _setUint(keccak256("mAllowed", msg.sender, _spender), _value);
    emit Approval(msg.sender, _spender, _value);
    return true;
  }

  /// @notice ERC20 backwards compatible allowance.
  ///  This function makes it easy to read the `allowed[]` map
  /// @param _owner The address of the account that owns the token
  /// @param _spender The address of the account able to transfer the tokens
  /// @return Amount of remaining tokens of _owner that _spender is allowed
  ///  to spend
  function allowance(address _owner, address _spender) public erc20 view returns (uint256 remaining) {
    return getUint(keccak256("mAllowed", _owner, _spender));
  }

  /// @notice Send `_value` amount of tokens to address `_to`
  /// @param _to The address of the recipient
  /// @param _value The amount of tokens to be sent
  function send(address _to, uint256 _value) public {
    doSend(
      msg.sender, 
      _to, 
      _value, 
      "", 
      msg.sender, 
      "", 
      true
    );
  }

  //todo jaycen are both send funcs needed for some backwards compat reason? check latest 777 draft
  /// @notice Send `_value` amount of tokens to address `_to` passing `_userData` to the recipient
  /// @param _to The address of the recipient
  /// @param _value The amount of tokens to be sent
  function send(address _to, uint256 _value, bytes _userData) public {
    doSend(
      msg.sender, 
      _to, 
      _value, 
      _userData, 
      msg.sender, 
      "", 
      true
    );
  }

  /// @notice Authorize a third party `_operator` to manage (send) `msg.sender`'s tokens.
  /// @param _operator The operator that wants to be Authorized
  //todo jaycen pretty sure overloads dont work so calling the following is impossible
  function authorizeOperator(address _operator) public {
    require(_operator != msg.sender, "Only the owner can authorize third party operators");
    _setBoolean(keccak256("mAuthorized", _operator, msg.sender), true);
    emit AuthorizedOperator(_operator, msg.sender);
  }

  /// @notice Authorize a third party `_operator` to manage [only some] (send) `msg.sender`'s tokens.
  /// @param _operator The operator that wants to be Authorized
  function authorizeOperator(address _operator, uint256 _value) public {
    require(_operator != msg.sender, "Only the owner can authorize third party operators");

    //todo jaycen only authorize an allowance
    _setBoolean(keccak256("mAuthorized", _operator, msg.sender), true);
    //todo jaycen is the following needed, It is not in the spec
    _setUint(keccak256("mAllowed", msg.sender,_operator), _value);
        
    callOperator(
      _operator, 
      msg.sender, 
      _operator, 
      _value, 
      "0x0", 
      "0x0", 
      true
    );

    emit AuthorizedOperator(_operator, msg.sender);
  }

  /// @notice Revoke a third party `_operator`'s rights to manage (send) `msg.sender`'s tokens.
  /// @param _operator The operator that wants to be Revoked
  function revokeOperator(address _operator) public {
    //todo jaycen IMPORTANT PRELAUNCH implement a revoke operation caller that can cancel market sales
    require(_operator != msg.sender, "Only the owner can revoke third party operators");
    _setBoolean(keccak256("mAuthorized", _operator, msg.sender), false);
    //todo jaycen is the following needed, It is not in the spec
    _setUint(keccak256("mAllowed", msg.sender,_operator), 0);
    emit RevokedOperator(_operator, msg.sender);
  }

  /// @notice Check whether the `_operator` address is allowed to manage the tokens held by `_tokenHolder` address.
  /// @param _operator address to check if it has the right to manage the tokens
  /// @param _tokenHolder address which holds the tokens to be managed
  /// @return `true` if `_operator` is authorized for `_tokenHolder`
  function isOperatorFor(address _operator, address _tokenHolder) public view returns (bool) {
    return _operator == _tokenHolder || getBoolean(keccak256("mAuthorized", _operator, _tokenHolder));
  }

  /// @notice Send `_value` amount of tokens on behalf of the address `from` to the address `to`.
  /// @param _from The address holding the tokens being sent
  /// @param _to The address of the recipient
  /// @param _value The amount of tokens to be sent
  /// @param _userData Data generated by the user to be sent to the recipient
  /// @param _operatorData Data generated by the operator to be sent to the recipient
  function operatorSend(
    address _operator, 
    address _from, 
    address _to, 
    uint256 _value, 
    bytes _userData, 
    bytes _operatorData
  ) public {
    require(isOperatorFor(_operator, _from), "Only the on operator can send authorized funds");
    //todo jaycen is the following needed, It is not in the spec
    _setUint(keccak256("mAllowed", _from, msg.sender), getUint(keccak256("mAllowed", _from, msg.sender)).sub(_value));

    doSend(
      _from, 
      _to, 
      _value, 
      _userData, 
      msg.sender, 
      _operatorData, 
      false
    );
  }

  /// @notice Send `_value` amount of tokens on behalf of the address `from` to the address `to`.
  /// @param _from The address holding the tokens being sent
  /// @param _to The address of the recipient
  /// @param _value The amount of tokens to be sent
  /// @param _userData Data generated by the user to be sent to the recipient
  /// @param _operatorData Data generated by the operator to be sent to the recipient
  function operatorSend(
    address _from, 
    address _to, 
    uint256 _value, 
    bytes _userData, 
    bytes _operatorData
  ) public {
    // for backwards compatibility (this should only be called when callOperator NOT being used)
    operatorSend(
      msg.sender, 
      _from, 
      _to, 
      _value, 
      _userData, 
      _operatorData
    );
  }

  /// @notice Burns `_value` tokens from `_tokenHolder`
  ///  Sample burn function to showcase the use of the `Burnt` event.
  /// @param _tokenHolder The address that will lose the tokens
  /// @param _value The quantity of tokens to burn
  //todo jaycen onlyProxyOwner modifier once finished with prs
  function burn(address _tokenHolder, uint256 _value) public onlyOwner {
    requireMultiple(_value);
    require(balanceOf(_tokenHolder) >= _value, "Insufficient balance");

    _setUint(keccak256("mBalances", _tokenHolder), getUint(keccak256("mBalances", _tokenHolder)).sub(_value));
    _setUint(keccak256("mTotalSupply"), getUint(keccak256("mTotalSupply")).sub(_value));

    emit Burnt(_tokenHolder, _value);
    if ( getBoolean(keccak256("mErc20compatible"))) {
      emit Transfer(_tokenHolder, 0x0, _value);
    }
  }

  /// @notice Generates `_value` tokens to be assigned to `_tokenHolder`
  /// @param _tokenHolder The address that will be assigned the new tokens
  /// @param _value The quantity of tokens generated
  /// @param _operatorData Data that will be passed to the recipient as a first transfer
  /// XXX: DO NOT SHIP TO PRODUCTION (use following instead :  function ownerMint(address _tokenHolder, uint256 _value, bytes _operatorData) public onlyOwner
  function mint(address _tokenHolder, uint256 _value, bytes _operatorData) public {
    requireMultiple(_value);
    
    _setUint(keccak256("mBalances", _tokenHolder), getUint(keccak256("mBalances", _tokenHolder)).add(_value));
    _setUint(keccak256("mTotalSupply"), getUint(keccak256("mTotalSupply")).add(_value));
    
    callRecipent(
      msg.sender, 
      0x0, 
      _tokenHolder, 
      _value, 
      "", 
      _operatorData, 
      true
    );

    emit Minted(
      _tokenHolder, 
      _value, 
      msg.sender, 
      _operatorData
    );

    if (getBoolean(keccak256("mErc20compatible"))) {
      emit Transfer(0x0, _tokenHolder, _value);
    }
  }

  /// @notice Internal function that ensures `_value` is multiple of the granularity
  /// @param _value The quantity that want's to be checked
  function requireMultiple(uint256 _value) internal view {
    uint _granularity = getUint(keccak256("mGranularity"));
    require(_value > 0 && _value.div(_granularity).mul(_granularity) == _value, "Sending amount must be larger than the specified granularity");
  }

  /// @notice Check whether an address is a regular address or not.
  /// @param _addr Address of the contract that has to be checked
  /// @return `true` if `_addr` is a regular address (not a contract)
  function isRegularAddress(address _addr) internal view returns(bool) {
    if (_addr == 0) {
      return false;
    }
    uint size;
    assembly { size := extcodesize(_addr) } // solium-disable-line security/no-inline-assembly
    return size == 0;
  }

  /// @notice Helper function actually performing the sending of tokens.
  /// @param _from The address holding the tokens being sent
  /// @param _to The address of the recipient
  /// @param _value The amount of tokens to be sent
  /// @param _userData Data generated by the user to be passed to the recipient
  /// @param _operatorData Data generated by the operator to be passed to the recipient
  /// @param _preventLocking `true` if you want this function to throw when tokens are sent to a contract not
  ///  implementing `IEIP777TokensRecipient` or not whitelisted in `tokenableContractsRegistry`.
  ///  ERC777 native Send functions MUST set this parameter to `true`, and backwards compatible ERC20 transfer
  ///  functions SHOULD set this parameter to `false`.
  function doSend(
    address _from,
    address _to,
    uint256 _value,
    bytes _userData,
    address _operator,
    bytes _operatorData,
    bool _preventLocking
  ) private {
    requireMultiple(_value);
    require(_to != address(0), "Sending to invalid addresses is not allowed");          // forbid sending to 0x0 (=burning)
    require(getUint(keccak256("mBalances", _from)) >= _value, "Insufficient balance"); // ensure enough funds
  
    _setUint(keccak256("mBalances", _from), getUint(keccak256("mBalances", _from)).sub(_value));
    _setUint(keccak256("mBalances", _to), getUint(keccak256("mBalances", _to)).add(_value));

    callRecipent(
      _operator, 
      _from, 
      _to, 
      _value, 
      _userData, 
      _operatorData, 
      _preventLocking
    );

    emit Sent(
      _from, 
      _to, 
      _value, 
      _userData, 
      _operator, 
      _operatorData
    );

    if ( getBoolean(keccak256("mErc20compatible"))) {
      emit Transfer(_from, _to, _value);
    }
  }

  /// @notice Helper function that checks for IEIP777TokensRecipient on the recipient and calls it.
  ///  May throw according to `_preventLocking`
  /// @param _from The address holding the tokens being sent
  /// @param _to The address of the recipient
  /// @param _value The amount of tokens to be sent
  /// @param _userData Data generated by the user to be passed to the recipient
  /// @param _operatorData Data generated by the operator to be passed to the recipient
  /// @param _preventLocking `true` if you want this function to throw when tokens are sent to a contract not
  ///  implementing `IEIP777TokensRecipient` or not whitelisted in `tokenableContractsRegistry`.
  ///  ERC777 native Send functions MUST set this parameter to `true`, and backwards compatible ERC20 transfer
  ///  functions SHOULD set this parameter to `false`.
  function callRecipent(
    address _operator,
    address _from,
    address _to,
    uint256 _value,
    bytes _userData,
    bytes _operatorData,
    bool _preventLocking
  ) private {
    address recipientImplementation = interfaceAddr(_to, "IEIP777TokensRecipient");
    if (recipientImplementation != 0) {
      IEIP777TokensRecipient(recipientImplementation).tokensReceived(
        _operator, 
        _from, 
        _to, 
        _value, 
        _userData, 
        _operatorData
      );
    } else if (_preventLocking) {
      require(isRegularAddress(_to), "Sending to contracts this token does not know about is not allowed while preventLocking is enabled");
    }
  }

  /// @notice Helper function that checks for IEIP777TokensOperator on the recipient and calls it.
  ///  May throw according to `_preventLocking`
  /// @param _from The address holding the tokens being sent
  /// @param _to The address of the recipient
  /// @param _value The amount of tokens to be sent
  /// @param _userData Data generated by the user to be passed to the recipient
  /// @param _operatorData Data generated by the operator to be passed to the recipient
  /// @param _preventLocking `true` if you want this function to throw when tokens are sent to a contract not
  ///  implementing `IEIP777TokensOperator`
  ///  ERC777 native Send functions MUST set this parameter to `true`, and backwards compatible ERC20 transfer
  ///  functions SHOULD set this parameter to `false`.
  function callOperator(
    address _operator,
    address _from,
    address _to,
    uint256 _value,
    bytes _userData,
    bytes _operatorData,
    bool _preventLocking
  ) private {
    address recipientImplementation = interfaceAddr(_to, "IEIP777TokensOperator");
    if (recipientImplementation != 0) {
      IEIP777TokensOperator(recipientImplementation).madeOperatorForTokens(
        _operator, 
        _from, 
        _to, 
        _value, 
        _userData, 
        _operatorData
      );
    } else if (_preventLocking) {
      require(isRegularAddress(_to), "Authorizing contracts this token does not know about is not allowed while preventLocking is enabled");
    }
  }
}