const config = require("./config");
const services = require("./services/services")({ config });
const routes = require("./routes");

// Require the framework and instantiate it
const fastify = require("fastify")({ logger: true });
const PORT = 3000;

// Declares routes
routes.forEach(route => fastify.route(route({ config, services })));

// Run the server!
const start = async () => {
  try {
    await fastify.listen(process.env.PORT || PORT);
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
