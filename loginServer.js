require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const loginRouter = require("./routes/login.route")
const secretNumberRouter = require("./routes/secretNumber.roate")
const adminRouter = require("./routes/admin.route")
const mongoose =require("mongoose");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/",loginRouter);
app.use("/",secretNumberRouter);
app.use("/",adminRouter);
mongoose.connect(
    `mongodb+srv://asadhm:${process.env.MONGODB_PASSWORD}@cluster0.jdmn4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
      console.log("Connected to DB");
    }
  );

app.listen(process.env.LOG_IN_PORT || 5001 ,()=>{
    console.log(`log in server listening on ${process.env.LOG_IN_PORT || 5001}`);
} 
)