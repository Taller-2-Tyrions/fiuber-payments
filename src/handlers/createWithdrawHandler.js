function schema() {
  return {
    params: {
      type: "object",
      properties: {
        receiverWalletId: {
          type: "string",
        },
        amountInEthers: {
          type: "string",
        },
      },
    },
    required: ["receiverWalletId", "amountInEthers"],
  };
}

function handler({ contractInteraction, walletService }) {
  return async function (req) {
    const receiverWallet = await walletService.getWallet(req.body.receiverWalletId);
    receiverWallet['id'] = req.body.receiverWalletId;
    return await contractInteraction.withdraw(receiverWallet, req.body.amountInEthers, walletService.getDeployerWallet());
  };
}

module.exports = { schema, handler };
