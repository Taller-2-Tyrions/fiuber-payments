const logger = require('simple-node-logger').createSimpleLogger();

const ethers = require("ethers");
var DbConnection = require("./db");
const accounts = [];

const getDeployerWallet =
  ({ config }) =>
  () => {
    const provider = new ethers.providers.AlchemyProvider(config.network, process.env.ALCHEMY_API_KEY);
    const wallet = ethers.Wallet.fromMnemonic(config.deployerMnemonic).connect(provider);
    console.log("Deployer wallet" + wallet.address);
    return wallet;
  };

const createWallet =
  ({ config }) =>
  async (user_id) => {
    const provider = new ethers.providers.AlchemyProvider(config.network, process.env.ALCHEMY_API_KEY);
    // This may break in some environments, keep an eye on it
    const wallet = ethers.Wallet.createRandom().connect(provider);
    // accounts.push({
    //   address: wallet.address,
    //   privateKey: wallet.privateKey,
    // });
    const result = {
      id: user_id,
      address: wallet.address,
      privateKey: wallet.privateKey,
    };
    await DbConnection.insert("wallets", result);
    // await DbConnection.insertWallet(result);
    return result;
  };

const getWalletsData = () => () => {
  return DbConnection.getWallets();
  // return accounts;
};

const getWalletData = () => user_id => {
  // return accounts[index - 1];

  const wallet = DbConnection.getWallet(user_id).then( wallet => {
    logger.info("Wallet retrieved: "+JSON.stringify(wallet));

    if(wallet == null){
      let err_msj = "Waller["+user_id+"] not exist";
      logger.error(err_msj);
      return {"error": err_msj};
    }
    return wallet;
  });
  return wallet;
};

const getWallet = ({ config }) => async senderId => {
    const provider = new ethers.providers.AlchemyProvider(config.network, process.env.ALCHEMY_API_KEY);
    const wallet = await DbConnection.getWallet(senderId);
    return new ethers.Wallet(wallet.privateKey, provider);
  };

module.exports = ({ config }) => ({
  createWallet: createWallet({ config }),
  getDeployerWallet: getDeployerWallet({ config }),
  getWalletsData: getWalletsData({ config }),
  getWalletData: getWalletData({ config }),
  getWallet: getWallet({ config })
});
