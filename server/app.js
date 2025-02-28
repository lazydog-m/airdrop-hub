require('dotenv').config();

const express = require('express');
const projectRoutes = require('./src/controllers/projectController');
const databaseSync = require('./src/utils/dbMigration');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();

const PORT = process.env.PORT || 3000;
const DB_ACTION = process.env.DB_ACTION || 'none';

app.use(express.json());

// middlewares
app.use('/projects', projectRoutes);

// error handler middleware
app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}.`);
  await databaseSync(DB_ACTION);
});


