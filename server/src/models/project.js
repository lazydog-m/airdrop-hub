const { DataTypes } = require('sequelize');
const db = require('../configs/dbConnection');
const { ProjectStatus } = require('../enums');

const Project = db.define('projects', {
  id: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  url: {
    type: DataTypes.STRING(10000),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM,
    values: [ProjectStatus.IN_PROGRESS],
    defaultValue: ProjectStatus.IN_PROGRESS,
  },
},
  {
    timestamps: true,
  });

module.exports = Project;
