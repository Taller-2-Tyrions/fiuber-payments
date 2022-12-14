const logger = require('../utils/utils').logger;

class WalletException extends Error {
  statusCode = 400;
  constructor(err_msj){
    super(err_msj);
  }
}

function existWalletError(user_id){
  return _throwBasicException(`Wallet[${user_id}] for user ${user_id} exist`);
}

function notExistWalletError(user_id){
  return _throwBasicException(`Wallet[${user_id}] not exist`);
}

function withdrawPaymentError(user_id){
  return _throwBasicException(`Wallet[${user_id}] doesn't have payment`);
}

function withdrawPaymentAmountError(user_id){
  return _throwBasicException(`Wallet[${user_id}] insufficient funds`);
}

function _throwBasicException(err_msj) {
  logger.error(err_msj);
  return new WalletException(err_msj);
}

module.exports = {
  notExistWalletError,
  withdrawPaymentError,
  withdrawPaymentAmountError,
  WalletException,
  existWalletError,
};
