const express = require('express');
const { HttpStatus } = require('../enums');
const RestApiException = require('../exceptions/RestApiException');
const api = express.Router();
const { getAllProjects, getProjectById } = require('../services/projectService');
const apiRes = require('../utils/apiResponse');

// Create a new user
// router.post('/', async (req, res) => {
//   try {
//     const user = await User.create(req.body);
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to create user.' });
//   }
// });

// Get all projects
api.get('/', async (req, res, next) => {
  try {
    const projects = await getAllProjects(req);
    return apiRes.toJson(res, projects);
  } catch (error) {
    next(error);
  }
});

// Get project by ID
api.get('/:id', async (req, res, next) => {
  try {
    const project = await getProjectById(req.params.id);
    return apiRes.toJson(res, project);
  } catch (error) {
    next(error);
  }
});
//
// // Update user by ID
// router.put('/:id', async (req, res) => {
//   try {
//     const [updatedRowsCount] = await User.update(req.body, {
//         where: { id: req.params.id }
//     });
//     if (updatedRowsCount === 0) {
//       res.status(404).json({ message: 'User not found.' });
//     } else {
//       const user = await User.findByPk(req.params.id);
//       res.json(user);
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to update user.' });
//   }
// });
//
// // Delete user by ID
// router.delete('/:id', async (req, res) => {
//   try {
//     const deletedRowsCount = await User.destroy({ where: { id: req.params.id } });
//     if (deletedRowsCount === 0) {
//       res.status(404).json({ message: 'User not found.' });
//     } else {
//       res.json({ message: 'User deleted successfully.' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to delete user.' });
//   }
// });

module.exports = api;
