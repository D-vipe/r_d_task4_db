const express = require("express");
const path = require("path");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const app = express(),
  session = require("express-session"),
  cookieParser = require("cookie-parser");

let corsOptions = {
  origin: "http://localhost:3000",
};

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "pug");

const userRouter = require("./routers/userRouter");
const homeRouter = require("./routers/homeRouter");

app.use(
  session({
    secret: uuidv4(),
    saveUninitialized: false,
    resave: false,
  })
);

app.use(cors(corsOptions));
app.use(cookieParser());

app.use(express.static(__dirname + "/assets"));
app.use("/users", userRouter);
app.use("/", homeRouter);

app.use(function (req, res, next) {
  res.status(404).send("Not Found");
});

app.listen(3000);
