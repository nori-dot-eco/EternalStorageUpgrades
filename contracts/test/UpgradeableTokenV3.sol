pragma solidity ^0.4.23;
import "../Ownable.sol";


// This contract is an example that you can instantiate a new token removing all compatibility with previous version.
contract UpgradeableTokenV3 is Ownable {

  function theOnlyFunction() public pure returns(string) {
    return "the only function";
  }
  function checkStateNotPreserved() public view returns(uint256) {
    return getUint(keccak256("mTotalSupply"));
  }
  function balanceOf(address _tokenHolder) public view returns (uint256) {
    return getUint(keccak256("mBalances", _tokenHolder));
  }

}