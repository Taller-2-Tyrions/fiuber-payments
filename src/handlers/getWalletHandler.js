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

function handler({ walletService }) {
  return async function (req, res) {
    const body = await walletService.getWalletData(req.params.user_id);
    return res.code(200).send(body);
  };
}

module.exports = { handler, schema };
