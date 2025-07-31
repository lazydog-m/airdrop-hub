const { chromium } = require('playwright')
const config = require('../../playwrightConfig');
const path = require('path')
const fs = require('fs');
const { getSocket } = require('../configs/socket');
const RestApiException = require('../exceptions/RestApiException');
const { spawn } = require('child_process');

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
      const profileIndex = findProfileIndexById(profileId);
      browsers.splice(profileIndex, 1);
      const socket = getSocket();
      socket.emit('profileIdClosed', { id: profileId });
    }
  });
}

function getOS() {
  const platform = process.platform;

  if (platform === 'win32') return 'windows';
  if (platform === 'darwin') return 'mac';
  if (platform === 'linux') return 'linux';

  return 'unknown';
}

function getChromePath() {
  const os = getOS();

  switch (os) {
    case 'windows':
      return 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    case 'linux':
      return '/usr/bin/google-chrome';
    default:
      throw new Error('Không hỗ trợ hệ điều hành này');
  }
}

const waitForCDPReady = async (port, timeout = 10000) => {
  const url = `http://127.0.0.1:${port}/json/version`;
  const start = Date.now();

  while (Date.now() - start < timeout) { // call lại api trong 10s nếu chưa done
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch (error) {
      console.log(error)
    }
    await new Promise(res => setTimeout(res, 300));
  }

  throw new Error(`CDP cổng ${port} chưa được mở sau ${timeout}ms`); // ??
};

async function openProfile({ profile, port, layout }) {

  const profilePath = path.join(config.PROFILE_DIR, profile.name);
  const chromePath = process.platform === 'win32'
    ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    : '/usr/bin/google-chrome';

  const profileLayout = getLayout(layout);

  const chromeLauncher = await import('chrome-launcher');

  const chrome = await chromeLauncher.launch({
    port,
    chromePath,
    userDataDir: profilePath,
    chromeFlags: [
      `--window-position=${profileLayout.x},${profileLayout.y}`,
      `--window-size=${profileLayout.width},${profileLayout.height}`,
      '--no-default-browser-check',
      '--hide-crash-restore-bubble',
      '--no-first-run',
    ]
  });

  const browser = await chromium.connectOverCDP(`http://127.0.0.1:${chrome.port}`);
  browser.on('disconnected', () => {
    console.log(`Profile ${profile.name} đã bị đóng`);
  });

  const context = browser.contexts()[0];
  const page = context.pages()[0] || await context.newPage();

  // closePageExtension(context, profileLayout)
  // closeProfileListener(context, profile.id)

  return { context, page, chrome };
}

// async function openProfile(profile, layout) {
//
//   const profilePath = path.join(config.PROFILE_DIR, profile.name);
//
//   // Map path folder ./extensions với các folder con bên trong 
//   const extensionPaths = fs.readdirSync(config.EXTENSION_DIR)
//     .map(ext => path.join(config.EXTENSION_DIR, ext))
//     .filter(extPath => fs.statSync(extPath).isDirectory());
//
//   const profileLayout = getLayout(layout);
//
//   const context = await chromium.launchPersistentContext(profilePath, {
//     headless: false,
//     chromiumSandbox: false,
//     ignoreDefaultArgs: ["--enable-automation", "--no-sandbox", '--disable-blink-features=AutomationControlled'],
//     args: [
//       `--window-position=${profileLayout.x},${profileLayout.y}`,
//       `--window-size=${profileLayout.width},${profileLayout.height}`,
//       '--no-sandbox',
//       '--disable-blink-features=AutomationControlled',
//       `--disable-extensions-except=${extensionPaths.join(',')}`,
//       `--load-extension=${extensionPaths.join(',')}`,
//     ],
//     // userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15A372 Safari/604.1',
//   })
//
//   const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage()
//   await page.setViewportSize({ width: profileLayout.width, height: profileLayout.height - 86 })
//
//   // closePageExtension(context, profileLayout)
//   // closeProfileListener(context, profile.id)
//
//   return { context, page };
// }

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
