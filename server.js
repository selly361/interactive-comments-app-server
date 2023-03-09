const express = require("express");
require("dotenv").config()
require('module-alias/register')

const app = express()

app.use(express.json())




const PORT = process.env.PORT || 3001;


app.listen(PORT, () => console.log(`Listening on port ${PORT}...`))