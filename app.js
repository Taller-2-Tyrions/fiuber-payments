require('dotenv').config();

const USER = process.env.PG_USER
const PASSWORD = process.env.PG_PASSWORD
const HOST = process.env.PG_HOST
const PORT = process.env.PG_PORT
const DATABASE_URL = process.env.PG_DATABASE_URL

const APP_PORT = 3010
const TIMEOUT = 30000;

const bodyParser = require('body-parser');
const express = require("express")

const request = require("request")
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args))
const app = express()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

var pgp = require("pg-promise")({
   capSQL: true
});//(/*options*/)
// var pgp = require("pg-promise")();

var db = pgp(DATABASE_URL);
var moment = require('moment')

/* For Hashing */
// var crypto = require('crypto');


const DATE_FORMAT = "YYYY-MM-DD HH:mm:ss"
const SELECT_ALL_TRANSACTION_FOR_ID = "SELECT * FROM transactions WHERE id = $1"

const CONTENT_TYPE_JSON = {'Content-Type': 'application/json' }
const EMPTY_JSON = "{}"

const id = Math.floor(Math.random() * 100);

var cors = require('cors')

/* Cors for other case */
// var corsOptions = {
//   origin: 'https://fiuber-voyage.herokuapp.com',
//   optionsSuccessStatus: 200
// }
//app.use(cors(corsOptions));

app.use(cors())

//app.post("/payments/:idUser", cors(corsOptions), async (req, res) => {
  app.post("/payments/:idUser", async (req, res) => {
  console.log("body: "+req.body+" amount: "+req.body.amount)
  var idUser  = parseInt(req.params.idUser)
  var amount = req.body.amount

  var creationDate = moment(new Date()).format(DATE_FORMAT);
  console.log(creationDate)
  
  const transaction = {user_id: idUser, creation_date: creationDate, amount: amount};
	
  console.log("Processing payment for user "+ idUser+" and Tx Obj:"+JSON.stringify(transaction))

  let insert = pgp.helpers.insert(transaction, null, 'transactions')
  await db.none(insert)

  let resData = ""
  res.set(CONTENT_TYPE_JSON)
  res.send(resData)
})

app.get("/transactions/:idTransaction", async (req,res) => {
  var idTransaction  = req.params.idTransaction
  console.log("Retrieve transaction "+ idTransaction)
  
  let res_data = await db.one(SELECT_ALL_TRANSACTION_FOR_ID, idTransaction)
      .then(data => {
        console.log("Data:", data)
        return JSON.stringify(data)
      })
      .catch(function (error) {
          console.log("Error:", error)
          return EMPTY_JSON
      })
  res.set(CONTENT_TYPE_JSON)
  res.send(res_data)
})

app.get("/", (req, res) => {
  res.status(200).send("OK, I'm Up!\n");
});

app.get("/ping", (req, res) => {
  console.log("ping OK\n");
  res.status(200).send("pong-pong!!!!!!\n");
});

app.get("/timeout", async (req, res) => {
  console.log("comenzo timeout... ");
  await new Promise((r) => setTimeout(r, 5000));
  console.log("timeout termino! ");
  res.status(200).send("OK, timeout 5 segundos\n");
});

app.get("/timeout-async", async (req, res) => {
  this.timeoutObj;
  console.log("timeout-async termino!");
  res.status(200).send("OK, timeout-async 5 segundos\n");
});

app.get("/heavy", async (req, res) => {
  var limit = 100000000;
  var sum = 0;
  var pi = 0;

  let start_time = new Date();
  console.log("Init time: " + start_time);

  for (var i = 1; i <= limit; i++) sum += 1 / i ** 2;

  pi = Math.sqrt(sum * 6);

  let end_time = new Date();
  console.log("End time: " + end_time);
  console.log("Diff time: " + Math.abs(start_time - end_time) / 1000 + "s");

  res.status(200).send(id + " - PI: " + pi + "\n");
});


app.listen(process.env.PORT || APP_PORT, () => {
  console.log("Escuchando en puerto =>", APP_PORT);
});
