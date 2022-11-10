const logger = require('simple-node-logger').createSimpleLogger();
const ethers = require("ethers");
const walletService = require("./wallets");
const getDepositHandler = require("../handlers/getDepositHandler");
var DbConnection = require("./db");

const getContract = (config, wallet) => {
  return new ethers.Contract(config.contractAddress, config.contractAbi, wallet);
};

const deposits = {};
const withdraws = {};

const deposit =
  ({ config }) =>
  async (senderWallet, amountToSend) => {
    const basicPayments = await getContract(config, senderWallet);
    const tx = await basicPayments.deposit({
      value: await ethers.utils.parseEther(amountToSend).toHexString(),
    });
    tx.wait(1).then(
      receipt => {
        console.log("Transaction mined");
        const firstEvent = receipt && receipt.events && receipt.events[0];
        console.log(firstEvent);
        if (firstEvent && firstEvent.event == "DepositMade") {
          data = {
            hash: tx.hash,
            senderAddress: firstEvent.args.sender,
            amountSent: firstEvent.args.amount,
          };
          DbConnection.insert("deposits", data);
          deposits[tx.hash] = data;
        } else {
          console.error(`Payment not created in tx ${tx.hash}`);
        }
      },
      error => {
        const reasonsList = error.results && Object.values(error.results).map(o => o.reason);
        const message = error instanceof Object && "message" in error ? error.message : JSON.stringify(error);
        console.error("reasons List");
        console.error(reasonsList);

        console.error("message");
        console.error(message);
      },
    );
    return tx;
  };


const withdraw = ({ config }) => async (receiverWallet, amountToSend, deployerWallet) => {
  console.log(deployerWallet)
  const basicPayments = await getContract(config, deployerWallet);
  const tx = await basicPayments.sendPayment(receiverWallet, await ethers.utils.parseEther(amountToSend).toHexString());
  tx.wait(1).then(
    receipt => {
      console.log("Transaction mined");
      const firstEvent = receipt && receipt.events && receipt.events[0];
      console.log(firstEvent);
      if (firstEvent && firstEvent.event == "PaymentMade") {
        data = {
          hash: tx.hash,
          receiverWallet: firstEvent.args.receiver,
          amountSent: firstEvent.args.amount,
        };
        /* Info sobre Tx */
        DbConnection.insert("withdraws", data);
      } else {
        console.error(`Withdraw not created in tx ${tx.hash}`);
      }
    },
    error => {
      const reasonsList = error.results && Object.values(error.results).map(o => o.reason);
      const message = error instanceof Object && "message" in error ? error.message : JSON.stringify(error);
      console.error("reasons List");
      console.error(reasonsList);

      console.error("message");
      console.error(message);
    },
  );
  return tx;
};

// TOMARLO DE LA BD Y ARMAR LO MISMO PARA LOS RETIROS
const getDepositReceipt = ({}) => async depositTxHash => {
    return deposits[depositTxHash];
  };

const getBalance = ({config}) => async (_addressBalance, deployerWallet) => {
  logger.info("Address balance",_address);

  const basicPayments = await getContract(config, deployerWallet);
  return await basicPayments.sendPayment[_addressBalance];
};

module.exports = dependencies => ({
  deposit: deposit(dependencies),
  withdraw: withdraw(dependencies),
  getDepositReceipt: getDepositReceipt(dependencies),
  getBalance: getBalance(dependencies),
});
