const express = require('express');
const { HttpStatus } = require('../enums');
const RestApiException = require('../exceptions/RestApiException');
const api = express.Router();
const apiRes = require('../utils/apiResponse');
const { getAllProfiles, getProfileById, createProfile, updateProfile, deleteProfile } = require('../services/profileService');

// Get all profiles
api.get('/', async (req, res, next) => {
  try {
    const profiles = await getAllProfiles(req);
    return apiRes.toJson(res, profiles);
  } catch (error) {
    next(error);
  }
});

// Get profile by ID
api.get('/:id', async (req, res, next) => {
  try {
    const profile = await getProfileById(req.params.id);
    return apiRes.toJson(res, profile);
  } catch (error) {
    next(error);
  }
});

// Create a new profile
api.post('/', async (req, res, next) => {
  const { body } = req;
  try {
    const createdProfile = await createProfile(body);
    return apiRes.toJson(res, createdProfile);
  } catch (error) {
    next(error);
  }
});

// Update a profile
api.put('/', async (req, res, next) => {
  const { body } = req;
  try {
    const updatedProfile = await updateProfile(body);
    return apiRes.toJson(res, updatedProfile);
  } catch (error) {
    next(error);
  }
});

// Delete a profile
api.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedProfile = await deleteProfile(id);
    return apiRes.toJson(res, deletedProfile);
  } catch (error) {
    next(error);
  }
});

module.exports = api;
