const path = require("path");
const axios = require("axios");
const puppeteer = require("puppeteer");
const chalk = require("chalk");
const moment = require("moment");

const SCREENSHOTS_FOLDER = path.resolve(__dirname, "../screenshots");
const PAGE_PREFIX = "https://localhost:9000/ledger1";

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

const ADMIN_PAGES = [
  "/admin/dashboard",
  "/admin/tasks",
  "/admin/groups?status=PENDING&status=ACTIVE",
  "/admin/users?status=ACTIVE&status=PENDING_APPROVAL&status=PENDING_REVOCATION&status=PENDING_REGISTRATION&status=ACCESS_SUSPENDED",
  "/admin/accounts?meta_status=APPROVED&meta_status=PENDING",
  "/admin/transactions?status=SUBMITTED&status=PENDING_APPROVAL&status=BLOCKED&status=ABORTED",
];

const OPERATOR_PAGES = ["/operator/dashboard"];

const ADMIN_MODALS = [
  ["/admin/accounts/view/1/accounts/details/1/overview", "account-details"],
  ["/admin/groups/details/3/overview", "group-details"],
  ["/admin/users/details/16/overview", "user-details"],
  ["/admin/transactions/details/2/overview", "transaction-details"],
];

async function main() {
  let browser;
  try {
    debug("launching browser");
    browser = await puppeteer.launch({
      headless: false,
      args: ["--ignore-certificate-errors"],
    });
    debug("browser launched");

    await login(browser, DEVICES.ADMIN1);
    await Promise.all(ADMIN_PAGES.map(url => shotStaticPage(browser, url)));

    // FIXME for no reason, forced to do a queue instead of parallel here
    // because it was f** up the screenshots
    await ADMIN_MODALS.reduce(
      (acc, [url, prefix]) =>
        acc.then(() => shotTabModal(browser, url, { prefix })),
      Promise.resolve(),
    );

    await login(browser, DEVICES.OPERATOR2);
    await Promise.all(OPERATOR_PAGES.map(url => shotStaticPage(browser, url)));

    await browser.close();
  } catch (err) {
    debug(chalk.red(err.toString()));
    if (browser) {
      await browser.close();
    }
    process.exit(1);
  }
}

async function login(browser, deviceID) {
  const page = await browser.newPage();
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
  await page.close();
}

async function shotStaticPage(browser, url) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1024 });
  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle0" }),
    page.goto(`${PAGE_PREFIX}${url}`),
  ]);
  await wait(50); // just to be sure
  await page.screenshot({
    path: path.join(
      SCREENSHOTS_FOLDER,
      `${url
        .split("?")[0]
        .substr(1)
        .replace(/\//g, "-")}.png`,
    ),
  });
  await page.close();
}

async function shotTabModal(browser, url, { prefix } = {}) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1024 });
  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle0" }),
    page.goto(`${PAGE_PREFIX}${url}`),
  ]);
  const tabsHandles = await page.$$("[data-role=modal-tab]");
  for (let i = 0; i < tabsHandles.length; i++) {
    const tabHandle = tabsHandles[i];
    if (i > 0) {
      await tabHandle.click();
      await wait(2e3);
    }
    await shotModal(page, `${prefix}--tab-${i}.png`);
  }
  await page.close();
}

async function shotModal(page, fileName) {
  const modalHandle = await page.$("[data-role=modal-inner]");
  const box = await modalHandle.boundingBox();

  await page.addStyleTag({
    content: `
      [data-role=modal-backdrop--disabled] {
        background: transparent !important;
      }
      #root {
        visibility: hidden;
      }
    `,
  });

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

main();
