import { testUpgradeabilityStorageFuncs } from './behaviors/UpgradeabilityStorage';

const UpgradeabilityStorageTests = () => {
  contract('UpgradeabilityStorage', () => {
    testUpgradeabilityStorageFuncs();
  });
};
export default UpgradeabilityStorageTests;
