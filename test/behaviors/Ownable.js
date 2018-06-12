import { assertRevert } from '../helpers/utils';
import { OwnableTest } from '../helpers/artifacts';
import { deployContract } from '../helpers/contracts';
import { testGetters } from './EternalStorage';

const withoutOwnerPermissions = (originalOwner, proposedOwner) => {
  let currentOwner;
  let ownable;
  beforeEach(async () => {
    ownable = await deployContract(OwnableTest, [], {
      from: originalOwner,
    });
    currentOwner = await ownable.getOwner();
  });
  context('Without Owner Permissions', () => {
    describe('transferOwnership', () => {
      it('should not be able to transfer ownerhsip from a non-owner', async () => {
        await assertRevert(
          ownable.transferOwnership(proposedOwner, {
            from: proposedOwner,
          })
        );
        currentOwner = await ownable.getOwner();
        assert.equal(originalOwner, currentOwner);
      });
    });
    context('Test getters as non-owner', () => {
      testGetters(proposedOwner, OwnableTest);
    });
  });
};

const withOwnerPermissions = (originalOwner, proposedOwner) => {
  let currentOwner;
  let ownable;
  beforeEach(async () => {
    ownable = await deployContract(OwnableTest, [], {
      from: originalOwner,
    });
    currentOwner = await ownable.getOwner();
  });
  context('With Owner Permissions', () => {
    describe('transferOwnership', () => {
      it('should transfer ownership and then return the new owner', async () => {
        await ownable.transferOwnership(proposedOwner, {
          from: originalOwner,
        });
        currentOwner = await ownable.getOwner();
        assert.equal(currentOwner, proposedOwner);
      });
      it('should transfer ownership and lose owner permissions', async () => {
        await ownable.transferOwnership(proposedOwner, {
          from: originalOwner,
        });
        await assertRevert(
          ownable.transferOwnership(originalOwner, {
            from: originalOwner,
          })
        );
        currentOwner = await ownable.getOwner();
        assert.equal(proposedOwner, currentOwner);
      });
    });
    context('Test getters and getters as owner', () => {
      testGetters(originalOwner, OwnableTest);
    });
  });
};

const withAnyPermission = (originalOwner, anyAccount) => {
  let ownable;
  beforeEach(async () => {
    ownable = await deployContract(OwnableTest, [], {
      from: originalOwner,
    });
  });
  context('With Any Permissions', () => {
    describe('getOwner', () => {
      it('should return the correct owner', async () => {
        const currentOwner = await ownable.getOwner({ from: anyAccount });
        assert.equal(currentOwner, originalOwner);
      });
    });
  });
  context('Test getters and getters as any account', () => {
    testGetters(anyAccount, OwnableTest);
  });
};

module.exports = {
  withAnyPermission,
  withOwnerPermissions,
  withoutOwnerPermissions,
};
