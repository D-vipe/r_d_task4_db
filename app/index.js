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
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(function (req, res, next) {
  res.status(404).send("Not Found");
});

app.listen(3000);
