'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Roles', [
      {
        role_id: 1,
        role_name: 'Admin',
        daily_upload_limit: null, // unlimited
       
      },
      {
        role_id: 2,
        role_name: 'Teacher',
        daily_upload_limit: 10,
       
      },
      {
        role_id: 3,
        role_name: 'Student',
        daily_upload_limit: 5,
        
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Roles', null, {});
  },
};
