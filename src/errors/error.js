const logger = require('../utils/utils').logger;

function notExistWalletError(user_id){
  let err_msj = "Waller["+user_id+"] not exist";
  logger.error(err_msj);
  return {"error": err_msj};
}

module.exports = { notExistWalletError };