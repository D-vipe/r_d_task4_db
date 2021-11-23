const express = require("express");
const checkAuth = require("../middleware/auth");
const homeController = require("../controllers/homeController.js");
const homeRouter = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Retrieve a list of users
 *     description: Retrieve a list of users.
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           html:
 *             schema:
 *               type: string
 *               example: <html>
*/
homeRouter.get("/", checkAuth, homeController.index);
module.exports = homeRouter;
