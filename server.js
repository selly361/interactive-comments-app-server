require("module-alias/register");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser")
const app = express();


app.use(cookieParser())
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


const authRouter = require("@authRoute")
const userRouter = require("@userRoute")

app.use("/", authRouter)

app.use("/user", userRouter)


const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
