import { assertRevert } from '../helpers/utils';
import {
  UpgradeableTokenV0,
  UpgradeableTokenV1,
  UpgradeableTokenV2,
  UpgradeableTokenV3,
  EIP820Registry,
} from '../helpers/artifacts';
import { deployContract, getLogs } from '../helpers/contracts';
import { upgradeTo } from './Upgrades';

const shouldBehaveLikeUpgradeableToken = (
  admin,
  mintRecipient,
  transferRecipient,
  upgradeable
) => {
  if (upgradeable === 0 || !upgradeable) {
    shouldBehaveLikeUpgradeableTokenV0(
      admin,
      mintRecipient,
      transferRecipient,
      upgradeable
    );
  } else if (upgradeable === 1) {
    shouldBehaveLikeUpgradeableTokenV1(
      admin,
      mintRecipient,
      transferRecipient,
      upgradeable
    );
  } else if (upgradeable === 2) {
    shouldBehaveLikeUpgradeableTokenV2(
      admin,
      mintRecipient,
      transferRecipient,
      upgradeable
    );
  } else if (upgradeable === 3) {
    shouldBehaveLikeUpgradeableTokenV3(
      admin,
      mintRecipient,
      transferRecipient,
      upgradeable
    );
  }
};

const shouldBehaveLikeUpgradeableTokenV0 = (
  admin,
  mintRecipient,
  transferRecipient,
  upgradeable
) => {
  let upgradeableTokenV0;
  let initialSupply;
  let proxy;

  beforeEach(async () => {
    if (upgradeable >= 0) {
      const upgradeToV = upgradeTo(upgradeable);
      [upgradeableTokenV0, initialSupply, proxy] = await upgradeToV(admin);
    } else {
      const eip820Registry = await EIP820Registry.new({ from: admin });
      upgradeableTokenV0 = await deployContract(
        UpgradeableTokenV0,
        ['NORI Token V0', 'NORI', 1, 0, eip820Registry.address],
        { from: admin }
      );
    }
  });
  it('should be testing the same version the proxy implements', async () => {
    if (upgradeable >= 0) {
      const proxyVersion = await proxy.version();
      assert.equal(proxyVersion, upgradeable);
    }
  });

  describe('name', () => {
    it('returns the correct name', async () => {
      const name = await upgradeableTokenV0.name();
      assert.equal(
        upgradeable >= 0 ? `Upgradeable NORI Token` : 'NORI Token V0',
        name
      );
    });
  });
  describe('totalSupply', () => {
    context('when there are no tokens', () => {
      it('returns zero', async () => {
        const totalSupply = await upgradeableTokenV0.totalSupply();
        assert.equal(totalSupply, initialSupply || 0);
      });
    });

    context('when there are some tokens', () => {
      beforeEach(async () => {
        await upgradeableTokenV0.mint(admin, 100, '0x0', { from: admin });
      });

      it('returns the total amount of tokens', async () => {
        const totalSupply = await upgradeableTokenV0.totalSupply();
        assert.equal(totalSupply, initialSupply + 100 || 100);
      });
    });
  });

  describe('balanceOf', () => {
    context('when the requested account has no tokens', () => {
      it('returns zero', async () => {
        const balance = await upgradeableTokenV0.balanceOf(mintRecipient);
        assert.equal(balance, 0);
      });
    });

    context('when the requested account has some tokens', () => {
      beforeEach(async () => {
        await upgradeableTokenV0.mint(mintRecipient, 100, '0x0', {
          from: admin,
        });
      });

      it('returns the total amount of tokens', async () => {
        const balance = await upgradeableTokenV0.balanceOf(mintRecipient);
        assert.equal(balance, 100);
      });
    });
  });

  context('toggle erc20 interface', () => {
    describe('disableERC20', () => {
      it('should disable erc20 compatibility and try to call an erc20 only function', async () => {
        await upgradeableTokenV0.disableERC20({ from: admin });
        await assertRevert(upgradeableTokenV0.decimals.call());
      });
    });
    describe('enableERC20', () => {
      it('should enable ERC20 compatibility and try to call an erc20 only function', async () => {
        await upgradeableTokenV0.enableERC20({ from: admin });
        const decimals = await upgradeableTokenV0.decimals.call();
        assert.equal(decimals, 18);
      });
    });
  });

  describe('transfer', () => {
    const amount = 100;
    context('when the sender does not have enough balance', () => {
      beforeEach(async () => {
        await upgradeableTokenV0.mint(mintRecipient, amount - 1, '0x0', {
          from: admin,
        });
      });
      it('reverts', async () => {
        await assertRevert(
          upgradeableTokenV0.transfer(transferRecipient, amount, {
            from: mintRecipient,
          })
        );
      });
    });
  });
};

const shouldBehaveLikeUpgradeableTokenV1 = (
  admin,
  mintRecipient,
  transferRecipient,
  upgradeable
) => {
  let upgradeableTokenV1;
  let proxy;
  // first, test that token V1 still behaves like V0
  context(
    'Assert that upgraded token can do everything that V0 could do',
    () => {
      shouldBehaveLikeUpgradeableTokenV0(
        admin,
        mintRecipient,
        transferRecipient,
        upgradeable
      );
    }
  );

  // second, test that token V1 can use the new functions and retrieve new state
  context('Assert that V1 functions and state are usable', () => {
    beforeEach(async () => {
      if (upgradeable >= 0) {
        const upgradeToV = upgradeTo(upgradeable);
        [upgradeableTokenV1, , proxy] = await upgradeToV(admin);
      } else {
        const eip820Registry = await EIP820Registry.new({ from: admin });
        upgradeableTokenV1 = await deployContract(
          UpgradeableTokenV1,
          ['NORI Token V1', 'NORI', 1, 0, eip820Registry.address],
          { from: admin }
        );
      }
    });
    it('should be testing the same version the proxy implements', async () => {
      if (upgradeable >= 0) {
        const proxyVersion = await proxy.version();
        assert.equal(proxyVersion, upgradeable);
      }
    });
    context('Set and get new state using functions newly added to V1', () => {
      describe('addNewState', () => {
        it('can set new state', async () => {
          assert.ok(await upgradeableTokenV1.addNewState({ from: admin }));
        });
      });
      describe('getNewState', () => {
        it('returns the new state', async () => {
          await upgradeableTokenV1.addNewState({ from: admin });
          const newStateVariable = await upgradeableTokenV1.getNewState({
            from: admin,
          });
          assert.equal(newStateVariable, 'new state');
        });
      });
    });
  });
};

const shouldBehaveLikeUpgradeableTokenV2 = (
  admin,
  mintRecipient,
  transferRecipient,
  upgradeable
) => {
  let upgradeableTokenV2;
  let proxy;

  context('Assert that V2 can do everything that V1 could do', () => {
    shouldBehaveLikeUpgradeableTokenV1(
      admin,
      mintRecipient,
      transferRecipient,
      upgradeable
    );
  });

  context('Assert that V2 can use upgraded V2 functions', () => {
    beforeEach(async () => {
      if (upgradeable >= 0) {
        const upgradeToV = upgradeTo(upgradeable);
        [upgradeableTokenV2, , proxy] = await upgradeToV(admin);
      } else {
        const eip820Registry = await EIP820Registry.new({ from: admin });
        upgradeableTokenV2 = await deployContract(
          UpgradeableTokenV2,
          ['NORI Token V2', 'NORI', 1, 0, eip820Registry.address],
          { from: admin }
        );
      }
    });
    it('should be testing the same version the proxy implements', async () => {
      if (upgradeable >= 0) {
        const proxyVersion = await proxy.version();
        assert.equal(proxyVersion, upgradeable);
      }
    });

    context('Set and get new state using functions newly added to V2', () => {
      let addNewStateLogs;
      beforeEach(async () => {
        await upgradeableTokenV2.addNewState({ from: admin });
        addNewStateLogs = await getLogs(upgradeableTokenV2.NewStateAdded);
      });

      context('After setting state', () => {
        describe('NewStateAdded (event)', () => {
          it('returns the new state', async () => {
            const newStateVariable = await upgradeableTokenV2.getNewState({
              from: admin,
            });
            assert.equal(newStateVariable, 'new state');
          });
          it('should put a NewStateAdded event into the logs', () => {
            assert.equal(
              addNewStateLogs.length,
              1,
              'Expected one NewStateAdded event to have been sent'
            );
          });
          it("should include a 'newStateVariable' arg", () => {
            assert.equal(
              addNewStateLogs[0].args.newStateVariable,
              'newStateVariable',
              'Expected NewStateAdded Event "newStateVariable" arg to be the name of the variable added'
            );
          });
        });
      });
    });
    context(
      'Test that V2 has deprecated the logic of a V1 function of the same name',
      () => {
        describe('funcThatV2ShouldDeprecate', () => {
          it('returns the string in V2 and not V1', async () => {
            const newStringReturned = await upgradeableTokenV2.funcThatV2ShouldDeprecate(
              { from: admin }
            );
            assert.equal(
              newStringReturned,
              'V1 func of same name has been deprecated'
            );
          });
        });
      }
    );
  });
};
// Test removing all token functionality and reset state
const shouldBehaveLikeUpgradeableTokenV3 = (
  admin,
  mintRecipient,
  transferRecipient,
  upgradeable
) => {
  let upgradeableTokenV3;
  let v2TotalSupply;
  beforeEach(async () => {
    if (upgradeable >= 0) {
      const upgradeToV = upgradeTo(upgradeable);
      [upgradeableTokenV3, v2TotalSupply] = await upgradeToV(admin);
    } else {
      upgradeableTokenV3 = await deployContract(UpgradeableTokenV3, {
        from: admin,
      });
    }
  });

  context('Assert that V3 can not call a standard V0 function', () => {
    describe('totalSupply', () => {
      it('should be an undefined function', done => {
        assert.ok(typeof upgradeableTokenV3.totalSupply === 'undefined');
        done();
      });
    });
  });
  context('Assert that V3 did not inherit state from V2', () => {
    describe('checkStateNotPreserved', () => {
      it('should verify state was not preserved', async () => {
        const supplyState = await upgradeableTokenV3.checkStateNotPreserved();
        assert.notEqual(supplyState, v2TotalSupply);
      });
    });
  });
  context('Assert that V3 can call its function', () => {
    // note: technically it can also call public Ownable functions
    describe('theOnlyFunction', () => {
      it('should return a string by calling the only function', async () => {
        const returnedString = await upgradeableTokenV3.theOnlyFunction();
        assert.equal(returnedString, 'the only function');
      });
    });
  });
};
module.exports = {
  shouldBehaveLikeUpgradeableToken,
  shouldBehaveLikeUpgradeableTokenV0,
  shouldBehaveLikeUpgradeableTokenV1,
  shouldBehaveLikeUpgradeableTokenV2,
  shouldBehaveLikeUpgradeableTokenV3,
};
