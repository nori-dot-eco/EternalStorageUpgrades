import abi from 'ethereumjs-abi';
import { assertRevert } from '../helpers/utils';
import {
  OwnedUpgradeabilityProxy,
  UpgradeabilityStorageTestV0,
  UpgradeabilityStorageTestV1,
  UpgradeabilityStorageTestV2,
} from '../helpers/artifacts';
import { getLogs } from '../helpers/contracts';
import { testUpgradeabilityProxyEvents } from './UpgradeabilityProxy';

const testOwnedUpgradeabilityProxyFuncs = (admin, ownedUpContract = false) => {
  let proxy;
  let v0;
  beforeEach(async () => {
    v0 = await UpgradeabilityStorageTestV0.new({ from: admin });
    proxy = ownedUpContract
      ? await ownedUpContract.new({ from: admin })
      : await OwnedUpgradeabilityProxy.new({ from: admin });

    await proxy.upgradeTo('0', v0.address, { from: admin });
  });
  describe('proxyOwner', () => {
    it('should return the admin account as the owner', async () => {
      const owner = await proxy.proxyOwner({ from: admin });
      assert.equal(owner, admin);
    });
  });
};

const testEvents = (admin, nonAdmin, ownedUpContract = false) => {
  let v0;
  let proxy;
  let transferOwnershipLogs; // ProxyOwnershipTransferred(address previousOwner, address newOwner);

  context('After transfering ownership', () => {
    before(async () => {
      v0 = await UpgradeabilityStorageTestV0.new({ from: admin });
      proxy = ownedUpContract
        ? await ownedUpContract.new({ from: admin })
        : await OwnedUpgradeabilityProxy.new({ from: admin });
      await proxy.upgradeTo('0', v0.address, { from: admin });
      await proxy.transferProxyOwnership(nonAdmin, { from: admin });
      transferOwnershipLogs = await getLogs(proxy.ProxyOwnershipTransferred);
    });
    describe('ProxyOwnershipTransferred (event)', () => {
      it('should put a ProxyOwnershipTransferred event into the logs', () => {
        assert.equal(
          transferOwnershipLogs.length,
          1,
          'Expected one ProxyOwnershipTransferred event to have been sent'
        );
      });
      it("should include a 'previousOwner' arg", () => {
        assert.equal(
          transferOwnershipLogs[0].args.previousOwner,
          admin,
          'Expected ProxyOwnershipTransferred Event "previousOwner" arg to be the admin account'
        );
      });
      it("should include an 'newOwner' arg", () => {
        assert.equal(
          transferOwnershipLogs[0].args.newOwner,
          nonAdmin,
          'Expected ProxyOwnershipTransferred Event "newOwner" arg to be the nonAdmin account'
        );
      });
    });
  });

  testUpgradeabilityProxyEvents(admin, ownedUpContract);
};

const testOwnedUpgradeabilityProxyInitialState = (
  admin,
  ownedUpContract = false
) => {
  let proxy;
  let v0;
  beforeEach(async () => {
    v0 = await UpgradeabilityStorageTestV0.new({ from: admin });
    proxy = ownedUpContract
      ? await ownedUpContract.new({ from: admin })
      : await OwnedUpgradeabilityProxy.new({ from: admin });
    await proxy.upgradeTo('0', v0.address, { from: admin });
  });
  describe('proxyOwner', () => {
    it('should return the admin account as the owner', async () => {
      const owner = await proxy.proxyOwner({ from: admin });
      assert.equal(owner, admin);
    });
  });
};

const testOnlyProxyOwnerOwnedUpgradeabilityProxyFuncs = (
  admin,
  nonAdmin,
  ownedUpContract = false
) => {
  let proxy;
  let v0;
  beforeEach(async () => {
    v0 = await UpgradeabilityStorageTestV0.new({ from: admin });
    proxy = ownedUpContract
      ? await ownedUpContract.new({ from: admin })
      : await OwnedUpgradeabilityProxy.new({ from: admin });
  });
  describe('upgradeTo', () => {
    it('should be able to upgrade the proxy', async () => {
      await proxy.upgradeTo('0', v0.address, { from: admin });
      const implementation = await proxy.implementation({ from: admin });
      assert.equal(implementation, v0.address);
    });
    it('should not be able to upgrade the proxy from a non admin account', async () => {
      await assertRevert(proxy.upgradeTo('0', v0.address, { from: nonAdmin }));
    });
  });
  describe('upgradeToAndCall', () => {
    let funcCallData;
    beforeEach(async () => {
      const methodId = abi.methodID('testProxyCall', []).toString('hex');
      const params = abi.rawEncode([], []).toString('hex');
      funcCallData = `0x${methodId}${params}`;
    });
    it('should be able to upgradeToAndCall the proxy', async () => {
      await proxy.upgradeToAndCall('0', v0.address, funcCallData, {
        from: admin,
      });
    });
    it('should not be able to upgradeToAndCall the proxy from a non admin account', async () => {
      await assertRevert(
        proxy.upgradeToAndCall('0', v0.address, funcCallData, {
          from: nonAdmin,
        })
      );
    });
  });
  describe('transferProxyOwnership', () => {
    it('should be able to transfer ownership of the proxy to a new address from an admin account', async () => {
      await proxy.transferProxyOwnership(nonAdmin, { from: admin });
      const owner = await proxy.proxyOwner({ from: admin });
      assert.equal(owner, nonAdmin);
    });
    it('should not be able to transfer ownership of the proxy to a new address from a non admin account', async () => {
      await assertRevert(
        proxy.transferProxyOwnership(nonAdmin, { from: nonAdmin })
      );
      const owner = await proxy.proxyOwner({ from: admin });
      assert.equal(owner, admin);
    });
    it('should not be able to transfer ownership of the proxy to a 0 address from an admin account', async () => {
      await assertRevert(proxy.transferProxyOwnership(0, { from: admin }));
      const owner = await proxy.proxyOwner({ from: admin });
      assert.equal(owner, admin);
    });
  });
};

const testOwnedUpgradeabilityProxyImplementer = (
  admin,
  nonAdmin,
  ownedUpContract = false
) => {
  let implementer;
  let proxy;
  let v0;
  beforeEach(async () => {
    v0 = await UpgradeabilityStorageTestV0.new({ from: admin });
    proxy = ownedUpContract
      ? await ownedUpContract.new({ from: admin })
      : await OwnedUpgradeabilityProxy.new({ from: admin });
    await proxy.upgradeTo('0', v0.address, { from: admin });
    implementer = await UpgradeabilityStorageTestV0.at(proxy.address, {
      from: admin,
    });
    assert.ok(implementer);
  });
  describe('implementation', () => {
    it('should return the address that implements the proxy', async () => {
      const implementation = await proxy.implementation({ from: admin });
      assert.equal(implementation, v0.address);
    });
  });
  describe('version', () => {
    it('should return the version', async () => {
      const version = await proxy.version({ from: admin });
      assert.equal(version, 0);
    });
  });

  context('test contract calls using proxy', () => {
    testProxyFunctions(admin, ownedUpContract);
  });

  describe('upgradeTo', () => {
    it('should upgrade to a new version', async () => {
      const v1 = await UpgradeabilityStorageTestV1.new({ from: admin });
      await proxy.upgradeTo('1', v1.address, { from: admin });
      const implementation = await proxy.implementation({ from: admin });
      assert.equal(implementation, v1.address);
    });

    it('should fail trying to upgrade from a non admin account', async () => {
      const v1 = await UpgradeabilityStorageTestV1.new({ from: admin });
      await assertRevert(proxy.upgradeTo('1', v1.address, { from: nonAdmin }));
    });

    it('should fail upgrading to the same version', async () => {
      await assertRevert(proxy.upgradeTo('0', v0.address, { from: admin }));
      const implementation = await proxy.implementation({ from: admin });
      assert.equal(implementation, v0.address);
    });

    it('should return the version', async () => {
      const version = await proxy.version({ from: admin });
      assert.equal(version, 0);
    });
  });
};

const testProxyFunctions = (admin, ownedUpContract = false) => {
  let v0;
  let proxy;
  let implementer;
  describe('testProxyCall', () => {
    it('should return the version', async () => {
      v0 = await UpgradeabilityStorageTestV0.new({ from: admin });
      proxy = ownedUpContract
        ? await ownedUpContract.new({ from: admin })
        : await OwnedUpgradeabilityProxy.new({ from: admin });
      await proxy.upgradeTo('0', v0.address, { from: admin });
      implementer = await UpgradeabilityStorageTestV0.at(proxy.address, {
        from: admin,
      });
      const testProxyCall = await implementer.testProxyCall({ from: admin });
      assert.equal(testProxyCall, 'test successful');
    });
  });

  context(
    'upgrade to v1 as an entirely new contract and test upgraded function',
    () => {
      describe('testProxyCall', () => {
        it('should return the version', async () => {
          const v1 = await UpgradeabilityStorageTestV1.new({ from: admin });
          proxy = await OwnedUpgradeabilityProxy.new({ from: admin });
          await proxy.upgradeTo('1', v1.address, { from: admin });
          implementer = await UpgradeabilityStorageTestV1.at(proxy.address, {
            from: admin,
          });
          const testProxyCall = await implementer.testProxyCall({
            from: admin,
          });
          assert.equal(testProxyCall, 'test V1 successful');
        });
      });
    }
  );
  context(
    'upgrade to v2 by inheriting v1 and test new function and v1 function',
    () => {
      describe('testProxyCall', () => {
        it('should return the version', async () => {
          const v2 = await UpgradeabilityStorageTestV2.new({ from: admin });
          proxy = await OwnedUpgradeabilityProxy.new({ from: admin });
          await proxy.upgradeTo('2', v2.address, { from: admin });
          implementer = await UpgradeabilityStorageTestV2.at(proxy.address, {
            from: admin,
          });
          const testProxyCall = await implementer.testProxyCall({
            from: admin,
          });
          assert.equal(testProxyCall, 'test V1 successful');
        });
      });
      describe('anotherTestProxyCall', () => {
        it('should return the version', async () => {
          const v2 = await UpgradeabilityStorageTestV2.new({ from: admin });
          proxy = await OwnedUpgradeabilityProxy.new({ from: admin });
          await proxy.upgradeTo('2', v2.address, { from: admin });
          implementer = await UpgradeabilityStorageTestV2.at(proxy.address, {
            from: admin,
          });
          const anotherTestProxyCall = await implementer.anotherTestProxyCall({
            from: admin,
          });
          assert.equal(anotherTestProxyCall, 'You can call the new function!');
        });
      });
    }
  );
};

module.exports = {
  testEvents,
  testOwnedUpgradeabilityProxyFuncs,
  testProxyFunctions,
  testOwnedUpgradeabilityProxyImplementer,
  testOnlyProxyOwnerOwnedUpgradeabilityProxyFuncs,
  testOwnedUpgradeabilityProxyInitialState,
};
