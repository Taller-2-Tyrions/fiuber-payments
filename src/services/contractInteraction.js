const constants = require('../utils/constants');
const logger = require('../utils/utils').logger;
const error = require("../errors/error");

const ethers = require("ethers");
const walletService = require("./wallets");
const getDepositHandler = require("../handlers/getDepositHandler");
var DbConnection = require("./db");

const deposits = {};
const withdraws = {};

function withdrawPayment(userIdFrom, amountWithDraw){
  DbConnection.getPayment(userIdFrom).then( payments => {
    let amountToWithDraw = parseFloat(amountWithDraw);

    if(payments == null){
      return error.withdrawPaymentError(userIdFrom);
    }
    if(payments.amount < amountToWithDraw){
      return error.withdrawPaymentAmountError(userIdFrom);
    }
    logger.info(`Before Payment Balance of ${userIdFrom}: ${payments.amount}`);

    const newAmount = payments.amount - amountToWithDraw;
    DbConnection.update(constants.DB_COLL_DRIVER_ACCOUNTS, {id: userIdFrom}, {amount: newAmount});

    logger.info(`Payment Balance OK`);
  });
}

const getContract = (config, wallet) => {
  return new ethers.Contract(config.contractAddress, config.contractAbi, wallet);
};

async function savePayment(receiverId, amount){
  let pay = DbConnection.getPayment(receiverId).then( payments => {
            
    if(payments == null){
      payments = {
        id: receiverId,
        amount: amount
      };
      DbConnection.insert(constants.DB_COLL_DRIVER_ACCOUNTS, payments);
    } else {
      payments.amount += amount;
      DbConnection.update(constants.DB_COLL_DRIVER_ACCOUNTS, {id: receiverId}, {amount: payments.amount});
    }
    logger.info(`After Balance of ${receiverId}: ${payments.amount}`);
  });
}

const deposit =
  ({ config }) =>
  async (senderWallet, payerId, receiverId, amountToSend) => {
    const basicPayments = await getContract(config, senderWallet);
    const tx = await basicPayments.deposit({
      value: await ethers.utils.parseEther(amountToSend).toHexString(),
    });
    tx.wait(1).then(
      receipt => {
        logger.info("Transaction mined");
        const firstEvent = receipt && receipt.events && receipt.events[0];
        logger.info(firstEvent);
        if (firstEvent && firstEvent.event == "DepositMade") {
          data = {
            hash: tx.hash,
            senderAddress: firstEvent.args.sender,
            amountSent: firstEvent.args.amount,
          };

          DbConnection.insert(constants.DB_COLL_DEPOSITS, data);
          deposits[tx.hash] = data;

          /* Save payment in db */
          const amount = parseFloat(amountToSend);
          const driver_earnings = amount - amount*constants.FIUBER_PERC_FEE;
          const fiuber_earnings = amount*constants.FIUBER_PERC_FEE;
          
          savePayment(receiverId, driver_earnings)
          savePayment("fiuber", fiuber_earnings)

          logger.info(`Payment ${payerId} to ${receiverId} for ${amount} OK`);
          // let pay = DbConnection.getPayment(receiverId).then( payments => {

        } else {
          logger.error(`Payment not created in tx ${tx.hash}`);
        }
      },
      error => {
        const reasonsList = error.results && Object.values(error.results).map(o => o.reason);
        const message = error instanceof Object && "message" in error ? error.message : JSON.stringify(error);
        logger.error("reasons List");
        logger.error(reasonsList);

        logger.error("message");
        logger.error(message);
      },
    );
    return tx;
  };

const withdraw = ({ config }) => async (userId, receiverAddress, amountWithDrawString, deployerWallet) => {
  logger.info("User Id withdraw: ", userId);
  logger.info("Receiver Wallet address: ", receiverAddress);
  logger.info("Amount withdraw: ", amountWithDrawString);
  logger.info("Deployer wallet: ", deployerWallet);

  const basicPayments = await getContract(config, deployerWallet);
  const tx = await basicPayments.sendPayment(receiverAddress, await ethers.utils.parseEther(amountWithDrawString).toHexString());
  tx.wait(1).then(
    receipt => {
      logger.info("Transaction mined");
      const firstEvent = receipt && receipt.events && receipt.events[0];
      logger.info("firstEvent: ", firstEvent);
      if (firstEvent && firstEvent.event == "PaymentMade") {
        data = {
          hash: tx.hash,
          receiverWallet: firstEvent.args.receiver,
          amountSent: firstEvent.args.amount,
        };
        /* Info sobre Tx */
        DbConnection.insert(constants.DB_COLL_WITHDRAWS, data);
        /* Update payments Balance */
        withdrawPayment(userId, amountWithDrawString);
      } else {
        logger.error(`Withdraw not created in tx ${tx.hash}`);
      }
    },
    error => {
      const reasonsList = error.results && Object.values(error.results).map(o => o.reason);
      const message = error instanceof Object && "message" in error ? error.message : JSON.stringify(error);
      logger.error("reasons List");
      logger.error(reasonsList);

      logger.error("message");
      logger.error(message);
    },
  );
  return tx;
};

module.exports = dependencies => ({
  deposit: deposit(dependencies),
  withdraw: withdraw(dependencies),
});
