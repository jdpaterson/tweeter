"use strict";

// Basic express setup:
require('dotenv').config();

const express       = require("express");
const bodyParser    = require("body-parser");
const app           = express();
const MongoClient = require("mongodb").MongoClient;
const MONGODB_URI = process.env.MONGODB_URI;//"mongodb://localhost:27017/tweeter";
console.log('MongoDB URI', MONGODB_URI);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

MongoClient.connect(MONGODB_URI, (err, db) => {
  console.log('Connected to MongoDB at: ', MONGODB_URI);
  const DataHelpers = require("./lib/data-helpers.js")(db);
  const tweetsRoutes = require("./routes/tweets")(DataHelpers);
  app.use("/tweets", tweetsRoutes);
  app.listen(process.env.PORT, () => {
    console.log('Logged into web server at port: ', process.env.PORT);
  });

})
