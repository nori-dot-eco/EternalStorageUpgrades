import { deployContract } from '../helpers/contracts';

const testEternalStorage = (owner, esContractToDeploy) => {
  testSettersAndGetters(owner, esContractToDeploy);
};
const testGetters = (owner, esContractToDeploy) => {
  let esContract;
  beforeEach(async () => {
    esContract = await deployContract(esContractToDeploy, []);
  });
  describe('getAddress', () => {
    it('should be able to get state by invoking getAddress', async () => {
      const anAddress = await esContract.getAddress(web3.sha3('anAddress'));
      assert.equal(anAddress, '0x0000000000000000000000000000000000000000');
    });
  });
  describe('getUint', () => {
    it('should be able to get state by invoking getAddress', async () => {
      const anUint = await esContract.getUint(web3.sha3('anUint'));
      assert.equal(anUint, 0);
    });
  });
  describe('getInt', () => {
    it(`should be able to change state by invoking setInt`, async () => {
      const anInt = await esContract.getInt(web3.sha3('anInt'));
      assert.equal(anInt, 0);
    });
  });
  describe('getBoolean', () => {
    it(`should be able to change state by invoking setBoolean`, async () => {
      const anBoolean = await esContract.getBoolean(web3.sha3('anBoolean'));
      assert.equal(anBoolean, false);
    });
  });
  describe('getString', () => {
    it(`should be able to change state by invoking setString`, async () => {
      const anString = await esContract.getString(web3.sha3('anString'));
      assert.equal(anString, '');
    });
  });
  describe('getBytes', () => {
    it(`should be able to change state by invoking setBytes`, async () => {
      const anBytes = await esContract.getBytes(web3.sha3('anBytes'));
      assert.equal(anBytes, '0x');
    });
  });
};

const testSettersAndGetters = (owner, esContractToDeploy) => {
  let esContract;
  beforeEach(async () => {
    esContract = await deployContract(esContractToDeploy, []);
  });

  describe('setAddress', () => {
    it('should be able to change state by invoking setAddress', async () => {
      await esContract.setAddress(web3.sha3('anAddress'), owner, {
        from: owner,
      });
      const anAddress = await esContract.getAddress(web3.sha3('anAddress'));
      assert.equal(anAddress, owner);
    });
  });
  describe('setUint', () => {
    it(`should be able to change state by invoking setUint`, async () => {
      await esContract.setUint(web3.sha3('anUint'), 1, {
        from: owner,
      });
      const anUint = await esContract.getUint(web3.sha3('anUint'));
      assert.equal(anUint, 1);
    });
  });
  describe('setInt', () => {
    it(`should be able to change state by invoking setInt`, async () => {
      await esContract.setInt(web3.sha3('anInt'), -1, {
        from: owner,
      });
      const anInt = await esContract.getInt(web3.sha3('anInt'));
      assert.equal(anInt, -1);
    });
  });
  describe('setBoolean', () => {
    it(`should be able to change state by invoking setBoolean`, async () => {
      await esContract.setBoolean(web3.sha3('anBoolean'), true, {
        from: owner,
      });
      const anBoolean = await esContract.getBoolean(web3.sha3('anBoolean'));
      assert.equal(anBoolean, true);
    });
  });
  describe('setString', () => {
    it(`should be able to change state by invoking setString`, async () => {
      await esContract.setString(web3.sha3('anString'), 'string', {
        from: owner,
      });
      const anString = await esContract.getString(web3.sha3('anString'));
      assert.equal(anString, 'string');
    });
  });
  describe('setBytes', () => {
    it(`should be able to change state by invoking setBytes`, async () => {
      await esContract.setBytes(web3.sha3('anBytes'), web3.sha3('bytes'), {
        from: owner,
      });
      const anBytes = await esContract.getBytes(web3.sha3('anBytes'));
      assert.equal(anBytes, web3.sha3('bytes'));
    });
  });
};

module.exports = {
  testGetters,
  testEternalStorage,
  testSettersAndGetters,
};
