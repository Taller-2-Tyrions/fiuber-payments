const constants = require('../utils/constants');
const logger = require('../utils/utils').logger;
const error = require("../errors/error");

const ethers = require("ethers");
const walletService = require("./wallets");
const getDepositHandler = require("../handlers/getDepositHandler");
var DbConnection = require("./db");

const deposits = {};
const withdraws = {};

function withdrawPayment(receiverId, amountToWithDraw){
  DbConnection.getPayment(receiverId).then( payments => {
            
    if(payments == null){
      return error.withdrawPaymentError(receiverId);
    }
    if(payments.amount < amountToWithDraw){
      return error.withdrawPaymentAmountError(receiverId);
    }
    logger.info(`Before Payment Balance of ${receiverId}: ${payments.amount}`);

    const newAmount = payments.amount - amountToWithDraw;
    DbConnection.update(constants.DB_COLL_DRIVER_ACCOUNT, {id: receiverId}, {amount: newAmount});

    logger.info(`Payment Balance OK`);
  });
}

const getContract = (config, wallet) => {
  return new ethers.Contract(config.contractAddress, config.contractAbi, wallet);
};

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
          DbConnection.insert("deposits", data);
          deposits[tx.hash] = data;

          /* Save payment in db */
          const amount = parseFloat(amountToSend);
          
          let pay = DbConnection.getPayment(receiverId).then( payments => {
            
            if(payments == null){
              payments = {
                id: receiverId,
                amount: amount
              };
              DbConnection.insert(constants.DB_COLL_DRIVER_ACCOUNT, payments);
            } else {
              logger.info(`Before Payment Balance of ${payerId}: ${payments.amount}`);
              payments.amount += amount;
              DbConnection.update(constants.DB_COLL_DRIVER_ACCOUNT, {id: receiverId}, {amount: payments.amount});
            }
          
            logger.info(`Payment ${payerId} to ${receiverId} for ${amount} OK`);
            logger.info(`After Balance of ${receiverId}: ${payments.amount}`);
            
          });
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

const withdraw = ({ config }) => async (receiverWallet, amountWithdraw, deployerWallet) => {
  logger.info("Receiver Wallet: ", receiverWallet);
  logger.info("Deployer wallet: ", deployerWallet);
  logger.info("Amount withdraw: ", amountWithdraw);

  const basicPayments = await getContract(config, deployerWallet);
  const tx = await basicPayments.sendPayment(receiverWallet.address, await ethers.utils.parseEther(amountWithdraw).toHexString());
  tx.wait(1).then(
    receipt => {
      logger.info("Transaction mined");
      const firstEvent = receipt && receipt.events && receipt.events[0];
      logger.info(firstEvent);
      if (firstEvent && firstEvent.event == "PaymentMade") {
        data = {
          hash: tx.hash,
          receiverWallet: firstEvent.args.receiver,
          amountSent: firstEvent.args.amount,
        };
        /* Info sobre Tx */
        DbConnection.insert("withdraws", data);
        /* Update payments Balance */
        withdrawPayment(receiverWallet.id, amountWithdraw);
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

// TOMARLO DE LA BD Y ARMAR LO MISMO PARA LOS RETIROS
const getDepositReceipt = ({}) => async depositTxHash => {
    return deposits[depositTxHash];
  };

// const getBalance = ({config}) => async (_addressBalance, deployerWallet) => {
//   logger.info("Address balance",_address);

//   const basicPayments = await getContract(config, deployerWallet);
//   return await basicPayments.sendPayment[_addressBalance];
// };

// const payVoyage = ({ config }) =>
//   async (payerWallet, receiverId, amount) => {
//     await deposit(payerWallet, amount).then( res => {
//       payments[receiverId] += amount;
//       logger.info(`Payment ${payerWallet.id} to ${receiverId} for ${amount} OK`);
//       logger.info(`Balance of ${payerWallet.id}: ${payments[receiverId]}`);
//       return;
//     });
    
//     return;
//   };

module.exports = dependencies => ({
  deposit: deposit(dependencies),
  withdraw: withdraw(dependencies),
  getDepositReceipt: getDepositReceipt(dependencies),
});
