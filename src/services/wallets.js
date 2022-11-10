const logger = require('../utils/utils').logger;
const error = require("../errors/error");

const ethers = require("ethers");
var DbConnection = require("./db");
const accounts = [];

const getDeployerWallet =
  ({ config }) =>
  () => {
    const provider = new ethers.providers.AlchemyProvider(config.network, process.env.ALCHEMY_API_KEY);
    const wallet = ethers.Wallet.fromMnemonic(config.deployerMnemonic).connect(provider);
    logger.info("Deployer wallet " + wallet.address);
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
};

const getWalletData = () => user_id => {
  const wallet = DbConnection.getWallet(user_id).then( wallet => {
    if(wallet == null){
      let err_msj = "Waller["+user_id+"] not exist";
      logger.error(err_msj);
      return {"error": err_msj};
    }
    return wallet;
  });
  return wallet;
};

const getWalletBalance = ({config}) => async user_id => {
    const provider = new ethers.providers.AlchemyProvider(config.network, process.env.ALCHEMY_API_KEY);
    const wallet = await DbConnection.getWallet(user_id);
    if(wallet == null){
      return error.notExistWalletError(user_id);
    }
    const balance = await provider.getBalance(wallet.address);
    let balanceRes = {"address": wallet.address, "balance": ethers.utils.formatEther(balance)}
    logger.info("Balance[", wallet.address,"]: ", balanceRes);

    return balance
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
  getWallet: getWallet({ config }),
  getWalletBalance: getWalletBalance({config})
});
