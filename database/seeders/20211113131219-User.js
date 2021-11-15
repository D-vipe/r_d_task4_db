'use strict';
const md5 = require('md5');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.bulkInsert('Users', [
      {
        name: 'Admin',
        email: 'admin@admin.ru',
        password: md5(md5('gogo123')),
        age: 31,
        isAdmin: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Jane Doe',
        email: 'test@test.ru',
        password: md5(md5('123456')),
        age: '35',
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Jon Doe',
        email: 'test2@test.ru',
        password: md5(md5('123456')),
        age: '',
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('Users', null, {});
  }
};
