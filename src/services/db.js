var MongoClient = require("mongodb").MongoClient;

var DbConnection = function () {
  var db = null;

  async function DbConnect() {
    try {
      console.log("Connecting to db");  
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
        console.log(`db connection is already alive`);
        return db;
      } else {
        console.log(`getting new db connection`);
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
    return wallet;
  }

  async function getWallets() {
    let _db = await Get();

    let collection = _db.collection("wallets");
    let wallets = await collection.find({}).toArray();
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