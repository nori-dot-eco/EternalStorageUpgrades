import { testUpgradeabilityOwnerStorage } from './behaviors/UpgradeabilityOwnerStorage';

const UpgradeabilityOwnerStorageTests = () => {
  contract('UpgradeabilityOwnerStorage', () => {
    testUpgradeabilityOwnerStorage();
  });
};
export default UpgradeabilityOwnerStorageTests;
