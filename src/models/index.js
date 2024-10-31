const sequelize = require('../config/database');
const User = require('./User');
const File = require('./File');

// Définition des relations
File.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'owner'
});

User.hasMany(File, {
  foreignKey: 'user_id',
  as: 'files'
});

// Synchronisation des modèles avec la base de données
const initDb = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to database has been established successfully.');
    
    await sequelize.sync({ alter: true });
    console.log('Database synchronized');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1); // Arrêter le processus en cas d'erreur
  }
};

module.exports = {
  sequelize,
  User,
  File,
  initDb
};
