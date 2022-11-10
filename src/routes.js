const getWalletData = require("./handlers/getWalletHandler");
const getWalletsData = require("./handlers/getWalletsHandler");
const createWallet = require("./handlers/createWalletHandler");
const createDeposit = require("./handlers/createDepositHandler");
const getDeposit = require("./handlers/getDepositHandler");
const createWithdraw = require("./handlers/createWithdrawHandler");
const getWalletBalance = require("./handlers/getWalletBalance");
const paymentVoyage = require("./handlers/paymentVoyage");
const paymentsVoyage = require("./handlers/paymentsVoyage");

function paymentsVoyageRoute({services, config}) {
  return {
    method: "GET",
    url: "/payments",
    schema: paymentsVoyage.schema(config),
    handler: paymentsVoyage.handler({ config, ...services }),
  };
}

function paymentVoyageRoute({services, config}) {
  return {
    method: "GET",
    url: "/payments/:user_id",
    schema: paymentVoyage.schema(config),
    handler: paymentVoyage.handler({ config, ...services }),
  };
}

function getWalletDataRoute({ services, config }) {
  return {
    method: "GET",
    url: "/wallet/:user_id",
    schema: getWalletData.schema(config),
    handler: getWalletData.handler({ config, ...services }),
  };
}

function getWalletsDataRoute({ services, config }) {
  return {
    method: "GET",
    url: "/wallets",
    schema: getWalletsData.schema(config),
    handler: getWalletsData.handler({ config, ...services }),
  };
}

function getWalletBalanceRoute({ services, config }) {
  return {
    method: "GET",
    url: "/balance/:user_id",
    schema: getWalletBalance.schema(config),
    handler: getWalletBalance.handler({ config, ...services }),
  };
}

function createWalletRoute({ services, config }) {
  return {
    method: "POST",
    url: "/wallet",
    schema: createWallet.schema(config),
    handler: createWallet.handler({ config, ...services }),
  };
}

function createDepositRoute({ services, config }) {
  return {
    method: "POST",
    url: "/deposit",
    schema: createDeposit.schema(config),
    handler: createDeposit.handler({ config, ...services }),
  };
}

// function getDepositRoute({ services, config }) {
//   return {
//     method: "GET",
//     url: "/deposit/:txHash",
//     schema: getDeposit.schema(config),
//     handler: getDeposit.handler({ config, ...services }),
//   };
// }

function createWithdrawRoute({ services, config }) {
  return {
    method: "POST",
    url: "/withdraw",
    schema: createWithdraw.schema(config),
    handler: createWithdraw.handler({ config, ...services }),
  };
}

module.exports = [
  getWalletDataRoute,
  getWalletsDataRoute,
  createWalletRoute,
  createDepositRoute,
  // getDepositRoute,
  createWithdrawRoute,
  getWalletBalanceRoute,
  paymentVoyageRoute,
  paymentsVoyageRoute
];
