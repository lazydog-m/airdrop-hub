const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
require('dotenv').config();

const caPath = path.join(__dirname, '../../ssl', 'isrgrootx1.pem');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'mysql',
  logging: false,
  dialectOptions: {
    ssl:
      process.env?.ENABLE_SSL === 'true'
        ? {
          minVersion: 'TLSv1.2',
          rejectUnauthorized: true,
          ca: caPath
            ? fs.readFileSync(caPath)
            : undefined,
        }
        : null,
  },
});

module.exports = sequelize;
