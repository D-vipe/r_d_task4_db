// allow us to hide our connection secret in the process.env object
require('dotenv').config();
const express = require("express"),
  path = require("path"),
  cors = require("cors"),
  { v4: uuidv4 } = require("uuid"),
  app = express(),
  session = require("express-session"),
  cookieParser = require("cookie-parser"),
  swaggerJSDoc = require("swagger-jsdoc"),
  swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Robot_Dreams Admin Panel Api',
    version: '1.0.0',
    description:
      'This is a REST API application made with Express. For Robot_Dreams Task',
    license: {
      name: 'Licensed Under MIT',
      url: 'https://spdx.org/licenses/MIT.html',
    },
    contact: {
      name: 'D-vipe',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: [path.join(__dirname, '/routers/*.js')],
};

const swaggerSpec = swaggerJSDoc(options);

let corsOptions = {
  origin: "http://localhost:3000",
};

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "pug");

// the messenger between our app and our database
const mongoose = require('mongoose')

// establish connection & give yourself a message so you know when its complete
const source = process.env.MONGO_DATABASE

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

mongoose.connect(source, {})
const connection = mongoose.connection
connection.once('open', () => {
  console.log("DB connected.");
})

app.use("/users", userRouter);
app.use("/", homeRouter);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(function (req, res, next) {
  res.status(404).send("Not Found");
});

app.listen(3000);
