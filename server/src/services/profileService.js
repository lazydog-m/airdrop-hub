const NotFoundException = require('../exceptions/NotFoundException');
const ValidationException = require('../exceptions/ValidationException');
const Joi = require('joi');
const RestApiException = require('../exceptions/RestApiException');
const { Sequelize, Op } = require('sequelize');
const Profile = require('../models/profile');
const sequelize = require('../configs/dbConnection');

const profileSchema = Joi.object({
  email: Joi.string().required().max(255).messages({
    'string.empty': 'Email không được bỏ trống!',
    'any.required': 'Email không được bỏ trống!',
    'string.max': 'Email chỉ đươc phép dài tối đa 255 ký tự!',
  }),
  email_password: Joi.string().required()
    .max(255)
    .messages({
      'string.empty': 'Mật khẩu email không được bỏ trống!',
      'any.required': 'Mật khẩu email không được bỏ trống!',
      'string.max': 'Mật khẩu email chỉ đươc phép dài tối đa 255 ký tự!',
    }),
  x_username: Joi.string()
    .max(255)
    .allow('')
    .messages({
      'string.max': 'Username X chỉ đươc phép dài tối đa 255 ký tự!',
    }),
  discord_username: Joi.string()
    .max(255)
    .allow('')
    .messages({
      'string.max': 'Username discord chỉ đươc phép dài tối đa 255 ký tự!',
    }),
  discord_password: Joi.string()
    .max(255)
    .allow('')
    .messages({
      'string.max': 'Mật khẩu discord chỉ đươc phép dài tối đa 255 ký tự!',
    }),
  telegram_phone: Joi.string()
    .max(10)
    .allow('')
    .messages({
      'string.max': 'Số điện thoại telegram chỉ đươc phép dài tối đa 10 ký tự!',
    }),
  note: Joi.string()
    .max(65535)
    .allow('')
    .messages({
      'string.max': 'Ghi chú chỉ đươc phép dài tối đa 65,535 ký tự!',
    }),
});

const getAllProfiles = async (req) => {

  const { page, search } = req.query;

  const currentPage = Number(page) || 1;
  const limit = 12;
  const offset = (currentPage - 1) * limit;

  const query = `
    SELECT 
    ROW_NUMBER() OVER (
        ORDER BY 
            p.createdAt DESC
    ) AS stt,
      p.id, 
      p.email, 
      p.x_username, 
      p.discord_password, 
      p.discord_username, 
      p.telegram_phone, 
      p.email_password, 
      p.createdAt
    FROM 
      profiles p
    WHERE p.deletedAt IS NULL
      AND (
        p.email LIKE :searchQuery 
        OR p.discord_username LIKE :searchQuery
        OR p.x_username LIKE :searchQuery
        OR p.telegram_phone LIKE :searchQuery
      )
    ORDER BY p.createdAt DESC
    LIMIT ${limit} OFFSET ${offset}
`;

  const data = await sequelize.query(query, {
    replacements: {
      searchQuery: `%${search}%`
    },
  });

  const countQuery = `
SELECT COUNT(*) AS total 
    FROM 
      profiles p
    WHERE p.deletedAt IS NULL
      AND (
        p.email LIKE :searchQuery 
        OR p.discord_username LIKE :searchQuery
        OR p.x_username LIKE :searchQuery
        OR p.telegram_phone LIKE :searchQuery
      )
`;

  const countResult = await sequelize.query(countQuery, {
    replacements: {
      searchQuery: `%${search}%`
    },
  });

  const total = countResult[0][0]?.total;
  const totalPages = Math.ceil(total / limit);

  return {
    data: data[0],
    pagination: {
      page: parseInt(currentPage, 10),
      totalItems: total,
      totalPages,
      hasNext: currentPage < totalPages,
      hasPre: currentPage > 1
    }
  };
}

const getProfileById = async (id) => {
  const profile = await Profile.findByPk(id);

  if (!profile) {
    throw new NotFoundException('Không tìm thấy hồ sơ này!');
  }

  return profile;
}

const createProfile = async (body) => {
  const data = validateProfile(body);

  const existingProfile = await Profile.findOne({
    where: {
      [Op.or]: [
        { email: data.email },
        { x_username: data.x_username },
        { discord_username: data.discord_username },
        { telegram_phone: data.telegram_phone },
      ],
    },
  });

  if (existingProfile) {
    if (existingProfile.email === data.email) {
      throw new RestApiException('Email đã tồn tại!');
    }
    if (existingProfile.x_username === data.x_username) {
      throw new RestApiException('Username X đã tồn tại!');
    }
    if (existingProfile.discord_username === data.discord_username) {
      throw new RestApiException('Username Discord đã tồn tại!');
    }
    if (existingProfile.telegram_phone === data.telegram_phone) {
      throw new RestApiException('Số điện thoại Telegram đã tồn tại!');
    }
  }

  const createdProfile = await Profile.create({
    ...data,
    x_username: data.x_username || null,
    discord_username: data.discord_username || null,
    discord_password: data.discord_password || null,
    telegram_phone: data.telegram_phone || null,
  });

  return createdProfile;
}

const updateProfile = async (body) => {
  const { id, stt } = body;
  const data = validateProfile(body);

  const existingProfile = await Profile.findOne({
    where: {
      [Op.or]: [
        { email: data.email, id: { [Op.ne]: id } },
        { x_username: data.x_username, id: { [Op.ne]: id } },
        { discord_username: data.discord_username, id: { [Op.ne]: id } },
        { telegram_phone: data.telegram_phone, id: { [Op.ne]: id } },
      ],
    },
  });

  if (existingProfile) {
    if (existingProfile.email === data.email) {
      throw new RestApiException('Email đã tồn tại!');
    }
    if (existingProfile.x_username === data.x_username) {
      throw new RestApiException('Username X đã tồn tại!');
    }
    if (existingProfile.discord_username === data.discord_username) {
      throw new RestApiException('Username Discord đã tồn tại!');
    }
    if (existingProfile.telegram_phone === data.telegram_phone) {
      throw new RestApiException('Số điện thoại Telegram đã tồn tại!');
    }
  }

  const [updatedCount] = await Profile.update({
    ...data,
    x_username: data.x_username || null,
    discord_username: data.discord_username || null,
    discord_password: data.discord_password || null,
    telegram_phone: data.telegram_phone || null,
  }, {
    where: {
      id: id,
    }
  });

  if (!updatedCount) {
    throw new NotFoundException('Không tìm thấy hồ sơ này!');
  }

  const updatedProfile = await Profile.findByPk(id);

  return {
    ...updatedProfile,
    stt,
  };
}

const deleteProfile = async (id) => {
  const [deletedCount] = await Profile.update({
    deletedAt: Sequelize.fn('NOW'),
  }, {
    where: {
      id: id,
    }
  });

  if (!deletedCount) {
    throw new NotFoundException('Không tìm thấy hồ sơ này!');
  }

  return id;
}

const validateProfile = (data) => {
  const { error, value } = profileSchema.validate(data, { stripUnknown: true });

  if (error) {
    throw new ValidationException(error.details[0].message);
  }

  return value;
};

module.exports = { getAllProfiles, getProfileById, createProfile, updateProfile, deleteProfile };



