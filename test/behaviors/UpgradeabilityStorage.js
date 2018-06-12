import { UpgradeabilityStorage } from '../helpers/artifacts';

const testUpgradeabilityStorageFuncs = () => {
  let upStorage;
  beforeEach(async () => {
    upStorage = await UpgradeabilityStorage.new();
  });
  describe('implementation', () => {
    it('should return the address that implements the proxy', async () => {
      const implementation = await upStorage.implementation();
      assert.equal(
        implementation,
        '0x0000000000000000000000000000000000000000'
      );
    });
  });
  describe('version', () => {
    it('should return the version', async () => {
      const version = await upStorage.version();
      assert.equal(version, 0);
    });
  });
};

module.exports = {
  testUpgradeabilityStorageFuncs,
};
