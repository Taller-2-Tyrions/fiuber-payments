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
        amount: {
          type: "string",
        },
      },
    },
    required: ["senderId", "receiverId", "amount"],
  };
}

function handler({ contractInteraction, walletService }) {
  return async function (req) {
    const payerWallet =  await walletService.getWallet(req.body.senderId);
    contractInteraction.payVoyage(payerWallet, req.body.receiverId, req.body.amount);
  };
}

module.exports = { schema, handler };