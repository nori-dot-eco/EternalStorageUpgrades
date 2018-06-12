import OwnedUpgradeabilityProxyTests from './OwnedUpgradeabilityProxy.test';
import EternalStorageTests from './EternalStorage.test';
import {
  EternalStorageProxy,
  EternalStorageProxyTest,
} from './helpers/artifacts';

const EternalStorageProxyTests = (admin, nonAdmin) => {
  contract('EternalStorageProxyTest', () => {
    contract('EternalStorageProxy', () => {
      OwnedUpgradeabilityProxyTests(admin, nonAdmin, EternalStorageProxy); // should be able to do everything OwnedUpgradeabilityProxy can
    });

    // This deploys a contract inheriting from EternalStorageProxy and exposing
    // public functions for all state setters so they can be easily tested.
    // YOU SHOULD NEVER DEPLOY THIS INSTEAD OF EternalStorageProxy (<- no "Test" at the end)
    EternalStorageTests(admin, EternalStorageProxyTest); // should be able to do everything EternalStorage can
  });
};
export default EternalStorageProxyTests;
