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
    /* First check if user has any Wallet */
    return DbConnection.getWallet(user_id).then( wallet => {
      logger.info("createWallet ", wallet);
      if(wallet == null){
        const provider = new ethers.providers.AlchemyProvider(config.network, process.env.ALCHEMY_API_KEY);
        // This may break in some environments, keep an eye on it
        const wallet = ethers.Wallet.createRandom().connect(provider);
        const result = {
          id: user_id,
          address: wallet.address,
          privateKey: wallet.privateKey,
        };
        DbConnection.insert("wallets", result);

        logger.info("Wallet created: ", result);

        return result;
      } else {
        return error.existWalletError(user_id);
      }
    });
  };

const getPaymentsBalance = ({config}) => async => {
  return DbConnection.getPayments();
};

const getPaymentBalance = ({config}) => async user_id => {
  return DbConnection.getPayment(user_id).then( payment => {
    if(payment == null){
      return error.withdrawPaymentError(user_id);
    }
    return payment;
  });
};

const getWalletsData = () => () => {
  return DbConnection.getWallets();
};

const getWalletData = ({config}) => async user_id => {
  const provider = new ethers.providers.AlchemyProvider(config.network, process.env.ALCHEMY_API_KEY);

  return DbConnection.getWallet(user_id).then( wallet => {
    if(wallet == null){
      return error.notExistWalletError(user_id);
    }
    
    return _getBalance(config, user_id).then(r => {
      wallet['balance'] = r['balance'];
      logger.info("Wallet info: ", JSON.stringify(wallet));
      return wallet;
    });
  });
};

async function _getBalance(config, user_id) {
    const provider = new ethers.providers.AlchemyProvider(config.network, process.env.ALCHEMY_API_KEY);
    const wallet = await DbConnection.getWallet(user_id);
    if(wallet == null){
      return error.notExistWalletError(user_id);
    }

    const balance = await provider.getBalance(wallet.address);
    let balanceRes = {"address": wallet.address, "balance": ethers.utils.formatEther(balance)}
    logger.info("Balance[", wallet.address,"]: ", balanceRes);

    return balanceRes;
};

//TODO: combinar con _getBalance
const getWalletBalance = ({config}) => async user_id => {
    const provider = new ethers.providers.AlchemyProvider(config.network, process.env.ALCHEMY_API_KEY);
    const wallet = await DbConnection.getWallet(user_id);
    if(wallet == null){
      return error.notExistWalletError(user_id);
    }

    const balance = await provider.getBalance(wallet.address);
    let balanceRes = {"address": wallet.address, "balance": ethers.utils.formatEther(balance)}
    logger.info("Balance[", wallet.address,"]: ", balanceRes);

    return balanceRes;
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
  getWalletBalance: getWalletBalance({config}),
  getPaymentBalance: getPaymentBalance({config}),
  getPaymentsBalance: getPaymentsBalance({config}),
});
