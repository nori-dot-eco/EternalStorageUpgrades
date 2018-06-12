import UpgradeableTokenTests from './UpgradeableToken.test';
import { shouldBehaveLikeUpgradeableToken } from './behaviors/UpgradeableToken';

const EternalStorageUpgradeScenarios = (
  admin,
  mintRecipient,
  transferRecipient
) => {
  context(
    'Test Upgradeable NORI Token Scenarios using EternalStorage approach',
    () => {
      context(
        'Deploy an upgradeable token and set (upgrade) the proxy to V0',
        () => {
          versionScenario(admin, mintRecipient, transferRecipient, 0);
        }
      );
      context(
        'Upgrade token at proxy from V0 to V1. Preserve V0 state, add and set new state, and add/call new functions.',
        () => {
          versionScenario(admin, mintRecipient, transferRecipient, 1);
        }
      );
      context(
        'Upgrade token at proxy from V1 to V2, change some functions',
        () => {
          versionScenario(admin, mintRecipient, transferRecipient, 2);
        }
      );
      context(
        'Upgrade token at proxy from V2 to V3, V3 does not inherit the previous versions and should not have any token functionality',
        () => {
          // only test upgradeabletoken function, skip ton token since it cant call those functions in this version
          shouldBehaveLikeUpgradeableToken(
            admin,
            mintRecipient,
            transferRecipient,
            3
          );
        }
      );
    }
  );
};

const versionScenario = (admin, mintRecipient, transferRecipient, version) => {
  context(`UpgradeableTokenV${version} at EternalStorageProxy`, () => {
    UpgradeableTokenTests(admin, mintRecipient, transferRecipient, version);
  });
};

module.exports = {
  EternalStorageUpgradeScenarios,
  versionScenario,
};
