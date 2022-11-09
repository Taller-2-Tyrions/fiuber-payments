function schema() {
  return {
    params: {
      type: "object",
      properties: {
        user_id: {
          type: "string",
        },
      },
    },
    required: ["user_id"],
  };
}

function handler({ contractInteraction, walletService }) {
  return async function (req) {
    return contractInteraction.getBalance(req.params.user_id, walletService.getDeployerWallet());
  };
}

module.exports = { schema, handler };
