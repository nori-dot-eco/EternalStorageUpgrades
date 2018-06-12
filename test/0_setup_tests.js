import {
  allAccounts,
  buyer0,
  buyer1,
  supplier0,
  supplier1,
  verifier,
  auditor,
  unregistered0,
  unregistered1,
  admin0,
  admin1,
} from './helpers/accounts';
import OwnableTests from './Ownable.test';
import UpgradeabilityProxyTests from './UpgradeabilityProxy.test';
import UpgradeabilityOwnerStorageTests from './UpgradeabilityOwnerStorage.test';
import ProxyTests from './Proxy.test';
import UpgradeabilityStorageTests from './UpgradeabilityStorage.test';
import EternalStorageProxyTests from './EternalStorageProxy.test';
import { EternalStorageUpgradeScenarios } from './UpgradeScenarios.test';

// NOTE: this will become the standard way of testing both scenarios and per-contract functions.
// The tests will be refactored to fit into here in future PRs
context('Setup test environment', () => {
  before(() => {
    console.info(`
      Tests have been set up with:
      admin0: ${admin0}
      admin1: ${admin1}
      supplier0: ${supplier0}
      supplier1: ${supplier1}
      buyer0: ${buyer0}
      buyer1: ${buyer1}
      verifier: ${verifier}
      auditor: ${auditor}
      unregistered0: ${unregistered0}
      unregistered1: ${unregistered1}
    `);
  });

  context('Execute tests', () => {
    ProxyTests();
    // Eternal storage upgrade tests
    UpgradeabilityStorageTests();
    OwnableTests(unregistered0, admin0, admin1);
    UpgradeabilityProxyTests();
    UpgradeabilityOwnerStorageTests();
    EternalStorageProxyTests(admin0, admin1);
  });

  context('Upgrade Scenarios', () => {
    EternalStorageUpgradeScenarios(admin0, admin1, unregistered0);
  });
});
