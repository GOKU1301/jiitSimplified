// config/db.js
const { Sequelize } = require('sequelize');
const config = require('./config.json');

// Choose the environment (default = development)
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    logging: false,
  }
);

async function connectToDB() {
  try {
    await sequelize.authenticate();
    console.log('✅ DB connected using config.json');
  } catch (error) {
    console.error('❌ DB connection failed:', error);
    process.exit(1);
  }
}

module.exports = {
  sequelize,
  connectToDB,
};
