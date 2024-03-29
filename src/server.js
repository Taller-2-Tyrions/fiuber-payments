const config = require("./config");
const services = require("./services/services")({ config });
const routes = require("./routes");

const APP_PORT = 3000;  

// Require the framework and instantiate it
const fastify = require("fastify")({ logger: true });
const PORT = 3000;

fastify.register(require("fastify-cors"), {
  origin: "*",
  methods: ["POST", "GET"],
});

// Declares routes
routes.forEach(route => fastify.route(route({ config, services })));

// Run the server!
const start = async () => {
  try {
    port = process.env.PORT || 3012;
    await fastify.listen(port, "0.0.0.0");
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
