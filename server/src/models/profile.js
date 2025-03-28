// const { DataTypes } = require('sequelize');
// const db = require('../configs/dbConnection');
// const { ProjectStatus, ProjectType, ProjectCost } = require('../enums');
//
// const Profile = db.define('profiles', {
//   id: {
//     primaryKey: true,
//     type: DataTypes.UUID,
//     defaultValue: DataTypes.UUIDV4,
//   },
//   name: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   url: {
//     type: DataTypes.STRING(1000),
//   },
//   tutorial_url: {
//     type: DataTypes.STRING(1000),
//   },
//   discord_url: {
//     type: DataTypes.STRING(1000),
//   },
//   funding_rounds_url: {
//     type: DataTypes.STRING(1000),
//   },
//   has_daily_tasks: {
//     type: DataTypes.BOOLEAN,
//     defaultValue: true,
//   },
//   is_cheating: {
//     type: DataTypes.BOOLEAN,
//     defaultValue: true,
//   },
//   end_date: {
//     type: DataTypes.DATE,
//   },
//   note: {
//     type: DataTypes.TEXT,
//   },
//   expected_airdrop_time: {
//     type: DataTypes.STRING(10),
//   },
//   status: {
//     type: DataTypes.ENUM,
//     values: [ProjectStatus.DOING, ProjectStatus.TGE, ProjectStatus.SNAPSHOT, ProjectStatus.END_AIRDROP, ProjectStatus.END_PENDING_UPDATE],
//     defaultValue: ProjectStatus.DOING,
//   },
//   type: {
//     type: DataTypes.ENUM,
//     values: [ProjectType.TESTNET, ProjectType.DEPIN, ProjectType.GAME, ProjectType.WEB, ProjectType.GALXE, ProjectType.RETROACTIVE],
//     defaultValue: ProjectType.TESTNET,
//   },
//   cost_type: {
//     type: DataTypes.ENUM,
//     values: [ProjectCost.FREE, ProjectCost.FEE, ProjectCost.HOLD],
//     defaultValue: ProjectCost.FREE,
//   },
// },
//   {
//     timestamps: true,
//   });
//
// module.exports = Project;
