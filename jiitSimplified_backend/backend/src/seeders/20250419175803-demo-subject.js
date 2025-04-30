'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Subjects', [
      {
        subject_id: 'CS101',
        subject_name: 'Introduction to Programming',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        subject_id: 'CS201',
        subject_name: 'Data Structures',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        subject_id: 'CS301',
        subject_name: 'Algorithms',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Subjects', null, {});
  },
};
