import {
  UpgradeabilityProxy,
  OwnedUpgradeabilityProxy,
  UpgradeabilityStorageTestV0,
} from '../helpers/artifacts';
import { getLogs } from '../helpers/contracts';

const testUpgradeabilityProxyFuncs = () => {
  let proxy;
  beforeEach(async () => {
    proxy = await UpgradeabilityProxy.new();
    assert.ok(proxy);
  });
  describe('implementation', () => {
    it('should return the address that implements the proxy', async () => {
      const implementation = await proxy.implementation();
      assert.equal(
        implementation,
        '0x0000000000000000000000000000000000000000'
      );
    });
  });
  describe('version', () => {
    it('should return the version', async () => {
      const version = await proxy.version();
      assert.equal(version, 0);
    });
  });
};

const testUpgradeabilityProxyEvents = (admin, ownedUpContract = false) => {
  let v0;
  let proxy;
  let upgradedLogs; // Upgraded(string version, address indexed implementation);

  context('After upgrading', () => {
    before(async () => {
      v0 = await UpgradeabilityStorageTestV0.new({ from: admin });
      proxy = ownedUpContract
        ? await ownedUpContract.new({ from: admin })
        : await OwnedUpgradeabilityProxy.new({ from: admin });
      await proxy.upgradeTo('0', v0.address, { from: admin });
      upgradedLogs = await getLogs(proxy.Upgraded);
    });
    describe('Upgraded (event)', () => {
      it('should put a Upgraded event into the logs', () => {
        assert.equal(
          upgradedLogs.length,
          1,
          'Expected one Upgraded event to have been sent'
        );
      });
      it("should include a 'version' arg", () => {
        assert.equal(
          upgradedLogs[0].args.version,
          '0',
          'Expected Upgraded Event "version" arg to be 0'
        );
      });
      it("should include an 'implementation' arg", () => {
        assert.equal(
          upgradedLogs[0].args.implementation,
          v0.address,
          'Expected Upgraded Event "implementation" arg to be the v0 address'
        );
      });
    });
  });
};

module.exports = {
  testUpgradeabilityProxyFuncs,
  testUpgradeabilityProxyEvents,
};
