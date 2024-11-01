const { Sequelize } = require('sequelize');
const config = require('../config/database');
const UserModel = require('./User');
const FileModel = require('./File');

const sequelize = new Sequelize(config.development);

// Initialiser les modèles
const User = UserModel(sequelize);
const File = FileModel(sequelize);

// Définition des relations
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
