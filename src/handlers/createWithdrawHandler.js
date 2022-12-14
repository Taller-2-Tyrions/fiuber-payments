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
        amountInEthers: {
          type: "string",
        },
      },
    },
    required: ["userId", "receiverAddress", "amountInEthers"],
  };
}

function handler({ contractInteraction, walletService }) {
  return async function (req) {
    return contractInteraction.withdraw(
      req.body.userId,
      req.body.receiverAddress,
      req.body.amountInEthers,
      walletService.getDeployerWallet()
    );
  };
}

module.exports = { schema, handler };
