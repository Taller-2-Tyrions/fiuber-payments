function schema() {
  return {
    params: {
      type: "object",
      properties: {
        receiverWallet: {
          type: "string",
        },
        amountInEthers: {
          type: "string",
        },
      },
    },
    required: ["receiverWallet", "amountInEthers"],
  };
}

function handler({ contractInteraction, walletService }) {
  return async function (req) {
    return contractInteraction.withdraw(req.body.receiverWallet, req.body.amountInEthers, walletService.getDeployerWallet());
  };
}

module.exports = { schema, handler };
