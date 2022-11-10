const logger = require('../utils/utils').logger;

function notExistWalletError(user_id){
  return basicError("Waller["+user_id+"] not exist");
}

function withdrawPaymentError(user_id){
  return basicError("Waller["+user_id+"] doesn't have payment or amount i");
}

function withdrawPaymentAmountError(user_id){
  return basicError("Waller["+user_id+"] insufficient funds");
}

function basicError(err_msj) {
  logger.error(err_msj);
  return {"error": err_msj}; 
}

module.exports = { notExistWalletError, withdrawPaymentError, withdrawPaymentAmountError };