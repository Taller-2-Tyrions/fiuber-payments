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
    return async function (req, reply) {
      const body = await walletService.getWalletBalance(req.params.user_id);
      reply.code(200).send(body);
    };
  }
  
  module.exports = { handler, schema };
  