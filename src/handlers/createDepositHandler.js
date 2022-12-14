function schema() {
  return {
    params: {
      type: "object",
      properties: {
        senderId: {
          type: "string",
        },
        receiverId: {
          type: "string",
        },
        amountInEthers: {
          type: "string",
        },
      },
    },
    required: ["senderId", "amountInEthers"],
  };
}

function handler({ contractInteraction, walletService }) {
  return async function (req) {
    const payerId = req.body.senderId;
    const receiverId = req.body.receiverId;
    const wallet =  await walletService.getWallet(req.body.senderId);
    return contractInteraction.deposit(wallet, payerId, receiverId, req.body.amountInEthers);
  };
}

module.exports = { schema, handler };
