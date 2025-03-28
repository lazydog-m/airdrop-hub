const Project = require('../models/project');
const NotFoundException = require('../exceptions/NotFoundException');
const ValidationException = require('../exceptions/ValidationException');
const Joi = require('joi');
const RestApiException = require('../exceptions/RestApiException');
const { ProjectType, ProjectStatus, ProjectCost } = require('../enums');
const { Op } = require('sequelize');

const projectSchema = Joi.object({
  name: Joi.string().required().max(255).messages({
    'string.empty': 'Tên dự án không được bỏ trống!',
    'any.required': 'Tên dự án không được bỏ trống!',
    'string.max': 'Tên dự án chỉ đươc phép dài tối đa 255 ký tự!',
  }),
  expected_airdrop_time: Joi.string()
    .max(10)
    .allow('')
    .messages({
      'string.max': 'Thời gian dự kiến trả Airdrop chỉ đươc phép dài tối đa 10 ký tự!',
    }),
  url: Joi.string()
    .max(1000)
    .allow('')
    .messages({
      'string.max': 'Url chỉ đươc phép dài tối đa 1000 ký tự!',
    }),
  tutorial_url: Joi.string()
    .max(1000)
    .allow('')
    .messages({
      'string.max': 'Tutorial url chỉ đươc phép dài tối đa 1000 ký tự!',
    }),
  discord_url: Joi.string()
    .max(1000)
    .allow('')
    .messages({
      'string.max': 'Discord url chỉ đươc phép dài tối đa 1000 ký tự!',
    }),
  funding_rounds_url: Joi.string()
    .max(1000)
    .allow('')
    .messages({
      'string.max': 'Funding rounds url chỉ đươc phép dài tối đa 1000 ký tự!',
    }),
  note: Joi.string()
    .max(65535)
    .allow('')
    .messages({
      'string.max': 'Ghi chú chỉ đươc phép dài tối đa 65,535 ký tự!',
    }),
  has_daily_tasks: Joi.boolean()
    .valid(true, false)
    .messages({
      'any.only': 'Task hàng ngày phải là true hoặc false!',
    }),
  is_cheating: Joi.boolean()
    .valid(true, false)
    .messages({
      'any.only': 'Cheating phải là true hoặc false!',
    }),
  cost_type: Joi.string()
    .valid(ProjectCost.FEE, ProjectCost.FREE, ProjectCost.HOLD)
    .messages({
      'any.only': 'Loại chi phí không hợp lệ!'
    }),
  type: Joi.string()
    .valid(ProjectType.GAME, ProjectType.DEPIN, ProjectType.TESTNET, ProjectType.WEB, ProjectType.GALXE, ProjectType.RETROACTIVE)
    .messages({
      'any.only': 'Loại dự án không hợp lệ!'
    }),
  status: Joi
    .valid(ProjectStatus.DOING, ProjectStatus.END_PENDING_UPDATE, ProjectStatus.TGE, ProjectStatus.SNAPSHOT, ProjectStatus.END_AIRDROP)
    .messages({
      'any.only': 'Trạng thái dự án không hợp lệ!'
    }),
});

const getAllProjects = async (req) => {
  const { selectedCostItems, selectedTypeItems, selectedStatusItems, selectedOtherItems } = req.query;

  const whereConditions = {};

  if (selectedStatusItems?.length > 0) {
    whereConditions.status = { [Op.in]: selectedStatusItems };
  }

  if (selectedTypeItems?.length > 0) {
    whereConditions.type = { [Op.in]: selectedTypeItems };
  }

  if (selectedCostItems?.length > 0) {
    whereConditions.cost_type = { [Op.in]: selectedCostItems };
  }

  if (selectedOtherItems?.length > 0) {

    if (selectedOtherItems?.includes('Cheating')) {
      whereConditions.is_cheating = true;
    }

    if (selectedOtherItems?.includes('Tasks Hàng Ngày')) {
      whereConditions.has_daily_tasks = true;
    }
  }

  const data = await Project.findAll({
    where: whereConditions,
    order: [['createdAt', 'DESC']],
  });

  return data;
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

  const createdProject = await Project.create({
    ...data,
    end_date: null,
  });

  return createdProject;
}

const updateProject = async (body) => {
  const { id } = body;
  const data = validateProject(body);

  const [updatedCount] = await Project.update({
    ...data,
    end_date: null,
  }, {
    where: {
      id: id,
    }
  });

  if (!updatedCount) {
    throw new NotFoundException('Không tìm thấy dự án này!');
  }

  const updatedProject = await Project.findByPk(id);

  return updatedProject;
}

const validateProject = (data) => {
  const { error, value } = projectSchema.validate(data, { stripUnknown: true });

  if (error) {
    throw new ValidationException(error.details[0].message);
  }

  return value;
};

module.exports = { getAllProjects, getProjectById, createProject, updateProject };



