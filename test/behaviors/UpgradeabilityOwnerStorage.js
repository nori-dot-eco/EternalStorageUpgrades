import { UpgradeabilityOwnerStorage } from '../helpers/artifacts';

const testUpgradeabilityOwnerStorage = () => {
  let upgradeabilityOwnerStorage;
  beforeEach(async () => {
    upgradeabilityOwnerStorage = await UpgradeabilityOwnerStorage.new();
    assert.ok(upgradeabilityOwnerStorage);
  });
  describe('implementation', () => {
    it('should return the address that implements the proxy', async () => {
      const upgradeabilityOwner = await upgradeabilityOwnerStorage.upgradeabilityOwner();
      assert.equal(
        upgradeabilityOwner,
        '0x0000000000000000000000000000000000000000'
      );
    });
  });
};

module.exports = {
  testUpgradeabilityOwnerStorage,
};
