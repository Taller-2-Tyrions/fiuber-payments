const constants = require('../utils/constants');
const logger = require('../utils/utils').logger;
const error = require("../errors/error");

const ethers = require("ethers");
var DbConnection = require("./db");
const { use } = require('chai');
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
        DbConnection.insert(constants.DB_COLL_WALLETS, result);

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

const getWalletsData = ({config}) => async () => {
  const provider = new ethers.providers.AlchemyProvider(config.network, process.env.ALCHEMY_API_KEY);

  var wallets = await DbConnection.getWallets();
  for (const wallet of wallets) {
    amount = await getBalance(provider, wallet);
    wallet['balance'] = amount;
  }
  return wallets;
}

const getWalletData = ({config}) => async user_id => {
  const provider = new ethers.providers.AlchemyProvider(config.network, process.env.ALCHEMY_API_KEY);

  var wallet = await DbConnection.getWallet(user_id);
  if(wallet == null){
    return error.notExistWalletError(user_id);
  }
  
  amount = await getBalance(provider, wallet);

  wallet['balance'] = amount;
  return wallet;
};

const getWalletBalance = ({config}) => async user_id => {
  const provider = new ethers.providers.AlchemyProvider(config.network, process.env.ALCHEMY_API_KEY);
  const wallet = await DbConnection.getWallet(user_id);
  if(wallet == null){
     return error.notExistWalletError(user_id);
  }

  const balance = await getBalance(provider, wallet);
  let balanceRes = {"address": wallet.address, "balance": balance}
  logger.info(`Balance[${wallet.id}]: ${JSON.stringify(balanceRes)}`);

  return balanceRes;
};


async function getBalance(provider, wallet){
  const balanceHex = await provider.getBalance(wallet.address);
  const balanceAmount = ethers.utils.formatEther(balanceHex);
  return balanceAmount;
}

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
