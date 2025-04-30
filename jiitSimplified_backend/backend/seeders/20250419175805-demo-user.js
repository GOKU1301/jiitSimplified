'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        user_id: 1,
        name: 'Admin User',
        email: 'admin@college.edu',
        role_id: 1, // Admin
        oauth_id: 'admin-google-id-123',
        roll_number: null,
        employee_id: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_id: 2,
        name: 'Teacher Alice',
        email: 'alice@college.edu',
        role_id: 2, // Teacher
        oauth_id: 'teacher-google-id-456',
        roll_number: null,
        employee_id: 'EMP12345',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_id: 3,
        name: 'Student Bob',
        email: 'bob@college.edu',
        role_id: 3, // Student
        oauth_id: 'student-google-id-789',
        roll_number: '2023UCS001',
        employee_id: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
