import { testEternalStorage } from './behaviors/EternalStorage';
import { EternalStorageTest } from './helpers/artifacts';

const EternalStorageTests = (owner, esContract) => {
  contract(
    esContract ? `${esContract.contractName}.EternalStorage` : 'EternalStorage',
    () => {
      testEternalStorage(owner, esContract || EternalStorageTest);
    }
  );
};
export default EternalStorageTests;
