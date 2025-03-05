const { DataTypes } = require('sequelize');
const db = require('../configs/dbConnection');
const { ProjectStatus, ProjectType, ProjectRating } = require('../enums');

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
    type: DataTypes.STRING(1000),
  },
  url_ref: {
    type: DataTypes.STRING(1000),
  },
  has_daily_tasks: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  funding_rounds: {
    type: DataTypes.STRING(1000),
  },
  end_date: {
    type: DataTypes.DATE,
  },
  status: {
    type: DataTypes.ENUM,
    values: [ProjectStatus.DOING, ProjectStatus.ENDED],
    defaultValue: ProjectStatus.DOING,
  },
  type: {
    type: DataTypes.ENUM,
    values: [ProjectType.TESTNET, ProjectType.DEPIN],
    defaultValue: ProjectType.TESTNET,
  },
},
  {
    timestamps: true,
  });

module.exports = Project;
