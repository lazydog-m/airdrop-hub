const { chromium } = require('playwright')
const config = require('../../playwrightConfig');
const path = require('path')
const fs = require('fs');
const { getSocket } = require('../configs/socket');
const RestApiException = require('../exceptions/RestApiException');

const browsers = [];

const currentProfiles = () => browsers.map((br) => br?.profile?.id);

const findProfileIndexById = (id) => {
  const profileIndex = browsers.findIndex((br) => br?.profile?.id === id);

  if (profileIndex === -1) {
    throw new RestApiException('Hồ sơ đã bị đóng!');
  }

  return profileIndex;
}

const closingByApiIds = new Set();

let isSortAll = false;
const setIsSortAll = (value) => { isSortAll = value; };

// Căn chỉnh theo dạng lưới theo số lượng cửa sổ
function createGridLayout(profileCount) {
  const cols = Math.ceil(Math.sqrt(profileCount));
  const rows = Math.ceil(profileCount / cols);
  const width = Math.floor(config.SCREEN_WIDTH / cols);
  const height = Math.floor(config.SCREEN_HEIGHT / rows);

  const layouts = [];
  for (let i = 0; i < profileCount; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    layouts.push({
      x: col * width,
      y: row * (height + 40),
      width,
      height
    });
  }
  return layouts;
}

function getLayout(layout) {
  const defaultLayout = {
    x: 0,
    y: 0,
    width: config.SCREEN_WIDTH / 2,
    height: config.SCREEN_HEIGHT
  }

  if (!layout) {
    return defaultLayout;
  }

  return layout;
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function closePageExtension(context, layout) {
  context.on('page', async (page) => {
    const url = page.url();
    if (url.startsWith('chrome-extension://')) {
      try {
        // set lại viewport khi close page ext (case tạo ví)
        await page.setViewportSize({ width: layout.width, height: layout.height - 85 })
        await page.close();
      } catch (error) {
        // do something
      }
    }
  });
}

function closeProfileListener(context, profileId) {
  context.on('close', () => {
    if (closingByApiIds.has(profileId)) {
      closingByApiIds.delete(profileId);
      return;
    }

    if (!isSortAll) {
      console.log('listenClose')
      const profileIndex = findProfileIndexById(profileId);
      browsers.splice(profileIndex, 1);
      const socket = getSocket();
      socket.emit('profileIdClosed', { id: profileId });
    }
  });
}

async function openProfile(profile, layout) {

  const profilePath = path.join(config.PROFILE_DIR, profile.name);

  // Map path folder ./extensions với các folder con bên trong 
  const extensionPaths = fs.readdirSync(config.EXTENSION_DIR)
    .map(ext => path.join(config.EXTENSION_DIR, ext))
    .filter(extPath => fs.statSync(extPath).isDirectory());

  const profileLayout = getLayout(layout);

  const context = await chromium.launchPersistentContext(profilePath, {
    headless: false,
    chromiumSandbox: false,
    ignoreDefaultArgs: ["--enable-automation", "--no-sandbox", '--disable-blink-features=AutomationControlled'],
    args: [
      `--window-position=${profileLayout.x},${profileLayout.y}`,
      `--window-size=${profileLayout.width},${profileLayout.height}`,
      '--no-sandbox',
      '--disable-blink-features=AutomationControlled',
      `--disable-extensions-except=${extensionPaths.join(',')}`,
      `--load-extension=${extensionPaths.join(',')}`,
    ],
    // userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15A372 Safari/604.1',
  })

  const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage()
  await page.setViewportSize({ width: profileLayout.width, height: profileLayout.height - 86 })

  closePageExtension(context, profileLayout)
  closeProfileListener(context, profile.id)

  return { context, page };
}

function openProfiles(profiles = []) {
  for (let i = 0; i < profiles.length; i++) {
    const profileName = profiles[i];

    const promise = new Promise(resolve => {
      openProfile(profileName, layouts[i]).then(async ({ context, page }) => {
        // contexts.push(context);
        // browsers.push({ context, page });
        browsers.push({ context, page, profileName })
        resolve(); // ✅ done promise
      });
    });

    profileOpenPromises.push(promise);
  }
}

// async function openProfileForScript(profilePath, index) {

//     const WIDTH = 500
//     const HEIGHT = 310
//     const cols = 4

//     const x = (index % cols) * WIDTH
//     const y = Math.floor(index / cols) * (HEIGHT + 40)

//     const context = await chromium.launchPersistentContext(profilePath, {
//         headless: false,
//         chromiumSandbox: false,
//         ignoreDefaultArgs: ["--enable-automation", "--no-sandbox", '--disable-blink-features=AutomationControlled'],
//         args: [
//             `--window-size=${WIDTH},${HEIGHT}`,
//             `--window-position=${x},${y}`,
//             '--no-sandbox',
//             '--disable-blink-features=AutomationControlled',
//             `--disable-extensions-except=${config.extensions.join(',')}`,
//             `--load-extension=${config.extensions.join(',')}`,
//         ],
//         // userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15A372 Safari/604.1',
//     })

// return { context, page };
// trong react dùng context để lưu các page được mở, close all khi reload trang

// }

module.exports = {
  openProfile,
  createGridLayout,
  delay,
  browsers,
  currentProfiles,
  findProfileIndexById,
  closingByApiIds,
  setIsSortAll,
}
