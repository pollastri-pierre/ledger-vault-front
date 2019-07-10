const path = require("path");
const axios = require("axios");
const puppeteer = require("puppeteer");
const chalk = require("chalk");
const moment = require("moment");

const SCREENSHOTS_FOLDER = path.resolve(__dirname, "../screenshots");

const wait = ms => new Promise(r => setTimeout(r, ms));

const debug = str =>
  console.log(`${chalk.grey(moment().format("HH:mm:ss"))} ${str}`); // eslint-disable-line no-console

const DEVICES = {
  ADMIN1: 4,
  ADMIN2: 5,
  ADMIN3: 6,
  OPERATOR1: 10,
  OPERATOR2: 11,
  OPERATOR3: 12,
};

async function screenshots(page) {
  const { login, shotPage, shotTabModal } = bindWithPage(page);

  await login(DEVICES.ADMIN1);
  await shotPage("/admin/dashboard");
  await shotPage("/admin/tasks");
  await shotPage("/admin/groups");
  await shotPage("/admin/users");
  await shotPage("/admin/accounts");
  await shotPage("/admin/transactions");
  await shotTabModal("/admin/users/details/16/overview", {
    prefix: "user-details",
  });
  await shotTabModal("/admin/accounts/view/1/accounts/details/1/overview", {
    prefix: "account-details",
  });
}

async function main() {
  let browser;
  try {
    debug("launching browser");
    browser = await puppeteer.launch({
      headless: false,
      args: ["--ignore-certificate-errors"],
    });
    debug("browser launched");
    debug("creating page");
    const page = await browser.newPage();
    await page.setViewport({
      width: 1280,
      height: 1024,
    });
    debug("page created");

    await screenshots(page);

    await browser.close();
  } catch (err) {
    debug(chalk.red(err.toString()));
    if (browser) {
      await browser.close();
    }
    process.exit(1);
  }
}

function bindWithPage(page) {
  async function goto(url) {
    await page.goto(`https://localhost:9000/ledger1${url}`);
  }
  async function login(deviceID) {
    await axios({
      method: "POST",
      url: "http://localhost:5001/switch-device",
      data: { device_number: deviceID },
    });
    await page.goto(`https://localhost:9000`);
    await page.evaluate(() => localStorage.clear());
    await page.type('input[type="text"]', "ledger1");
    await page.click("[data-test=continue_button]");
    await page.waitForSelector(".App");
    await wait(200);
  }

  let nonce = 0;
  async function shotPage(url, { delay = 3e3 } = {}) {
    await goto(url);
    await wait(delay);
    await page.screenshot({
      path: path.join(
        SCREENSHOTS_FOLDER,
        `${`0${++nonce}`.slice(-2)}-${url.substr(1).replace(/\//g, "-")}.png`,
      ),
    });
  }

  async function shotModal(fileName) {
    const modalHandle = await page.$("[data-role=modal-inner]");
    const box = await modalHandle.boundingBox();
    await page.screenshot({
      path: path.join(SCREENSHOTS_FOLDER, fileName),
      clip: {
        x: box.x - 20,
        y: box.y - 20,
        width: box.width + 40,
        height: box.height + 40,
      },
    });
  }

  async function shotTabModal(url, { delay = 2e3, prefix } = {}) {
    await goto(url);
    await wait(delay);
    const tabsHandles = await page.$$("[data-role=modal-tab]");
    for (let i = 0; i < tabsHandles.length; i++) {
      const tabHandle = tabsHandles[i];
      if (i > 0) {
        await tabHandle.click();
        await wait(2e3);
      }
      await shotModal(`${`0${++nonce}`.slice(-2)}-${prefix}--tab-${i}.png`);
    }
  }

  return { login, goto, shotPage, shotTabModal };
}

main();
