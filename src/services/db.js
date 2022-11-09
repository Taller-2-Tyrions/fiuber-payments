const logger = require('simple-node-logger').createSimpleLogger();
var MongoClient = require("mongodb").MongoClient;

var DbConnection = function () {
  var db = null;

  async function DbConnect() {
    try {
      logger.info("Connecting to db");
      let url = process.env.DATABASE_URI;
      let _db = await MongoClient.connect(url);

      return _db.db("payments");
    } catch (e) {
      return e;
    }
  }

  async function Get() {
    try {
      if (db != null) {
        logger.info(`DB connection is already alive`);
        return db;
      } else {
        logger.info(`Getting new db connection`);
        db = await DbConnect();
        return db;
      }
    } catch (e) {
      return e;
    }
  }

  async function insert(collection, data) {
    let _db = await Get();

    let _collection = _db.collection(collection);
    let _data = await _collection.insertOne(data);
    return _data;
  }

  async function getWallet(user_id) {
    let _db = await Get();
    let collection = await _db.collection("wallets");
    let wallet = await collection.findOne({"id":user_id});

    logger.info('Wallet retrieved[', user_id, ']: ', JSON.stringify(wallet));

    return wallet;
  }

  async function getWallets() {
    let _db = await Get();

    let collection = _db.collection("wallets");
    let wallets = await collection.find({}).toArray();

    logger.info('All wallets retrieved: ', JSON.stringify(wallets));

    return wallets;
  }

  return {
    Get,
    insert,
    getWallet,
    getWallets
  };
};

module.exports = DbConnection();