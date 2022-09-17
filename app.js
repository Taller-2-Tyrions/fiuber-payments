require('dotenv').config();

const USER = process.env.PG_USER
const PASSWORD = process.env.PG_PASSWORD
const HOST = process.env.PG_HOST
const PORT = process.env.PG_PORT
const DATABASE = process.env.PG_DATABASE

const APP_PORT = 3010
const TIMEOUT = 5000;

const express = require("express")
const request = require("request")
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args))
const app = express()

var pgp = require("pg-promise")(/*options*/)
let conn = "postgres://"+USER+":"+PASSWORD+"@"+HOST+":"+PORT+"/"+DATABASE
var db = pgp(conn);

/* For Hashing */
// var crypto = require('crypto');


const SELECT_ALL_TRANSACTION_FOR_ID = "SELECT * FROM transactions WHERE id = $1"
const CONTENT_TYPE_JSON = {'Content-Type': 'application/json' }
const EMPTY_JSON = "{}"

const id = Math.floor(Math.random() * 100);

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
