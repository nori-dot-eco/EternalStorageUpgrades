import { shouldBehaveLikeTonToken } from './behaviors/TonToken';
import { shouldBehaveLikeUpgradeableToken } from './behaviors/UpgradeableToken';

const UpgradeableTokenTests = (
  admin,
  mintRecipient,
  transferRecipient,
  upgradeable
) => {
  contract(`UpgradeableTokenV${upgradeable || 0}`, () => {
    // temporay test suite showing that a troage/logic seperated instance of UpgradeableTokenV0 behaves identical to TonToken tests
    shouldBehaveLikeTonToken(
      admin,
      mintRecipient,
      transferRecipient,
      upgradeable
    ); // upgradeable is an optional var that tests the specified number. excluding it will test it as TonToken without an upgradeable proxy
    // tests for logic storage separated token
    shouldBehaveLikeUpgradeableToken(
      admin,
      mintRecipient,
      transferRecipient,
      upgradeable
    ); // upgradeable is an optional var that tests the specified number. excluding it will test it as V0 without an upgradeable proxy
  });
};
export default UpgradeableTokenTests;
