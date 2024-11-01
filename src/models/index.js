// models/index.js
const sequelize = require('../config/database');
const User = require('./User');
const File = require('./File');

// Les relations restent les mêmes
File.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'owner'
});

User.hasMany(File, {
  foreignKey: 'user_id',
  as: 'files'
});

const initDb = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to database has been established successfully.');

    await sequelize.sync({ alter: true });
    console.log('Database synchronized');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

module.exports = {
  sequelize,
  User,
  File,
  initDb
};