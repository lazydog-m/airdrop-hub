const Project = require('../models/project');
const NotFoundException = require('../exceptions/NotFoundException');
const ValidationException = require('../exceptions/ValidationException');
const { getPagination, getPageItems } = require('../utils/page');
const Joi = require('joi');
const RestApiException = require('../exceptions/RestApiException');

const projectSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.base': 'Project name must be a string!',
    'string.empty': 'Project name is required!',
    'any.required': 'Project name is required!',
  }),
  type: Joi.string().required().messages({
    'string.base': 'Project type must be a string!',
    'string.empty': 'Project type is required!',
    'any.required': 'Project type is required!',
  }),
  total_raised: Joi.number().allow(null).messages({
    'number.base': 'Total raised must be a number.',
  }),
  status: Joi.string().required().messages({
    'string.base': 'Project status must be a string!',
    'string.empty': 'Project status is required!',
    'any.required': 'Project status is required!',
  }),
  url: Joi.string().uri().allow(null, '').messages({
    'string.base': 'URL must be a string!',
    'string.uri': 'URL must be a valid URI.',
  }),
  url_ref: Joi.string().uri().allow(null, '').messages({
    'string.base': 'URL reference must be a string!',
    'string.uri': 'URL reference must be a valid URI.',
  }),
  rating: Joi.string().required().messages({
    'string.base': 'Project rating must be a string!',
    'string.empty': 'Project rating is required!',
    'any.required': 'Project rating is required!',
  }),
});

const getAllProjects = async (req) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);

  const pageData = await Project.findAndCountAll({
    limit,
    offset,
  });

  return pageData;
}

const getProjectById = async (id) => {
  const project = await Project.findByPk(id);

  if (!project) {
    throw new NotFoundException(`Not found project with id ${id}`)
  }

  return project;
}

const createProject = async (body) => {
  const data = validateProject(body);

  const existingProject = await Project.findOne({ name: data.name });
  if (existingProject) {
    throw new RestApiException(`Project name "${data.name}" already exists.`);
  }

  const createdProject = await Project.create({
    ...data,
    url: data.url || null,
    url_ref: data.url_ref || null,
    total_raised: data.total_raised || null,
  });

  return createdProject;
}

const validateProject = (data) => {
  const { error, value } = projectSchema.validate(data, { stripUnknown: true });

  if (error) {
    throw new ValidationException(error.details[0].message);
  }

  return value;
};

module.exports = { getAllProjects, getProjectById, createProject };



