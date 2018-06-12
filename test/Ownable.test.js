import {
  withOwnerPermissions,
  withoutOwnerPermissions,
  withAnyPermission,
} from './behaviors/Ownable';

const OwnableTests = (anyAccount, originalOwner, proposedOwner) => {
  contract('OwnableTest', () => {
    withAnyPermission(originalOwner, anyAccount);
    withOwnerPermissions(originalOwner, proposedOwner);
    withoutOwnerPermissions(originalOwner, proposedOwner);
  });
};
export default OwnableTests;
