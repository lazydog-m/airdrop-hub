const Project = require('../models/project');
const NotFoundException = require('../exceptions/NotFoundException');
const { getPagination, getPageItems } = require('../utils/page');

const getAllProjects = async (req) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);
  const pageData = await Project.findAll({ limit, offset });
  const pageData1 = await Project.findAndCountAll({ limit, offset, attributes: ["id", "name"], });
  console.log(pageData1.totalItems)
  console.log(pageData1.count)
  console.log(pageData1)
  // return getPageItems(pageData, page, limit);
  return pageData1;
}

const getProjectById = async (id) => {
  const project = await Project.findByPk(id);

  if (!project) {
    throw new NotFoundException(`Not found project with id ${id}`)
  }

  return project;
}

module.exports = { getAllProjects, getProjectById };



