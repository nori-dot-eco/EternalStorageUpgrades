import {
  testOwnedUpgradeabilityProxyImplementer,
  testOnlyProxyOwnerOwnedUpgradeabilityProxyFuncs,
  testOwnedUpgradeabilityProxyInitialState,
  testOwnedUpgradeabilityProxyFuncs,
  testEvents,
} from './behaviors/OwnedUpgradeabilityProxy';

const OwnedUpgradeabilityProxyTests = (
  admin,
  proposedAdmin,
  ownedUpContract = false
) => {
  contract(
    ownedUpContract
      ? `${ownedUpContract.contractName}.OwnedUpgradeabilityProxy`
      : 'OwnedUpgradeabilityProxy',
    () => {
      testOwnedUpgradeabilityProxyInitialState(admin, ownedUpContract);
      testOwnedUpgradeabilityProxyFuncs(admin, ownedUpContract);
      testOnlyProxyOwnerOwnedUpgradeabilityProxyFuncs(
        admin,
        proposedAdmin,
        ownedUpContract
      );
      testEvents(admin, proposedAdmin, ownedUpContract);
      testOwnedUpgradeabilityProxyImplementer(
        admin,
        proposedAdmin,
        ownedUpContract
      );
    }
  );
};
export default OwnedUpgradeabilityProxyTests;
