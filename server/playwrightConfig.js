// config.js
const path = require('path')

module.exports = {
  SCREEN_WIDTH: 1900,
  SCREEN_HEIGHT: 980,
  MAX_PROFILE: 12,

  EXTENSION_DIR: path.join(__dirname, './extensions'),
  PROFILE_DIR: path.join(__dirname, './profiles'),

  DELAY_3S: 3000,
  DELAY_OPEN_PROFILE: 50,
};
