const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const DB = require("./Db/database");
const path = require('path');
require("dotenv").config()
require('express-async-errors');

// create express app
const app = require("./app");


const port = process.env.PORT || 5001;

app.listen(port, async () => {
  await DB(process.env.MONGODB_URI);
  console.log(`Server is listening on port ${port}`);
});

