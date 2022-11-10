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
  return async function (req, reply) {
    const body = await walletService.getPaymentBalance(req.params.user_id);
    return reply.code(200).send(body);
  };
}

module.exports = { schema, handler };