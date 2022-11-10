function schema() {
  return {
    params: {
      type: "object",
      properties: {
        userId: {
          type: "string",
        },
        receiverAddress: {
          type: "string",
        },
        amount: {
          type: "string",
        },
      },
    },
    required: ["userId", "receiverAddress", "amount"],
  };
}

function handler({ contractInteraction, walletService }) {
  return async function (req) {
    // const receiverWallet = await walletService.getWallet(req.body.receiverWalletId);
    // receiverWallet['id'] = req.body.receiverWalletId;
    // return contractInteraction.withdraw(receiverWallet, req.body.amountInEthers, walletService.getDeployerWallet());
    return contractInteraction.withdraw(req.body.userId, req.body.receiverAddress, req.body.amount, walletService.getDeployerWallet());
  };
}

module.exports = { schema, handler };
