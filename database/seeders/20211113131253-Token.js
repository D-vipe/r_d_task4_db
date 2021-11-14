'use strict';
const { v4: uuidv4 } = require("uuid");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.bulkInsert('Tokens', [
      {
        token: uuidv4(),
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        token: uuidv4(),
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        token: uuidv4(),
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        token: uuidv4(),
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        token: uuidv4(),
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        token: uuidv4(),
        userId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        token: uuidv4(),
        userId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('Tokens', null, {});
  }
};
