require("module-alias/register");
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "development"
        ? true
        : process.env.NODE_ENV === "production"
        ? process.env.ORIGIN
        : false
  })
);


const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
