import { testUpgradeabilityProxyFuncs } from './behaviors/UpgradeabilityProxy';

const UpgradeabilityProxyTests = () => {
  contract('UpgradeabilityProxy', () => {
    testUpgradeabilityProxyFuncs();
  });
};
export default UpgradeabilityProxyTests;
