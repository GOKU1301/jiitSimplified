'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Papers', [
      {
        subject_id: 'CS101',
        title:'Intrduction to programming',
        year: 2023,
        term: 'T1',
        uploaded_by: 2, // uploaded by Teacher Alice
        file_url: 'https://example-bucket.s3.amazonaws.com/cs101_t1_2023.pdf',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        subject_id: 'CS201',
        title:'Algroithms',
        year: 2022,
        term: 'T2',
        uploaded_by: 3, // uploaded by Student Bob
        file_url: 'https://example-bucket.s3.amazonaws.com/cs201_t2_2022.pdf',
        createdAt: new Date(),
        updatedAt: new Date(),
      },  
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Papers', null, {});
  },
};
