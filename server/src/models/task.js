const { DataTypes } = require('sequelize');
const db = require('../configs/dbConnection');

const Task = db.define('tasks', {
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
},
  {
    timestamps: true,
  });

module.exports = Task;
