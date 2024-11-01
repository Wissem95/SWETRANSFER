const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const File = sequelize.define(
  "File",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    original_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    file_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    size: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    mime_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    share_link: {
      type: DataTypes.STRING(36),
      unique: true,
      allowNull: true,
    },
    share_expiration: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "files",
    timestamps: true,
  }
);

module.exports = File;
