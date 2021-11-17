const express = require("express");
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
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                   description: page title
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: user id
 *                       example: 3
 *                     is_admin:
 *                       type: boolean
 *                       description: a flag if a user has admin privilege
 *                       example: false
 *                     name:
 *                       type: string
 *                       description: user name
 *                       example: John Doe
 *                 usersList:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: user id
 *                         example: 1
 *                       email:
 *                         type: string
 *                         description: user email
 *                         example: "test@test.com"
 *                       passowrd:
 *                         type: string
 *                         description: encrypted password
 *                         example: "df9aba65b8a732d72481e9fe85db2aee"
 *                       name:
 *                         type: string
 *                         description: user name
 *                         example: "John Doe"
 *                       age:
 *                         type: string
 *                         description: user age
 *                         example: "21"
 *                       isAdmin:
 *                         type: boolean
 *                         description: flag showing if user has admin rights
 *                         example: true
 *                       createdAt:
 *                         type: date
 *                       updatedAt:
 *                         type: date
*/
homeRouter.get("/", homeController.index);
module.exports = homeRouter;
