const express = require("express");
const mysql = require("mysql");

const app = express()


app.use(express.json())



const PORT = process.env.PORT || 3001;


app.listen(PORT, () => console.log(`Listening on port ${PORT}...`))