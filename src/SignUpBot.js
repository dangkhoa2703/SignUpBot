// Require selenium webdriver
let { Builder, Browser, By, Key, until } = require("selenium-webdriver");
let fs = require("fs");
let assert = require("assert");

async function click(driver, path) {
  await driver.findElement(By.xpath(path)).click();
}

async function signUpBot(account) {
  let driver = await new Builder().forBrowser("chrome").build();
  try {
    await driver.get(
      // replace with a link of your favorite sport booking URL
      "https://www.buchsys.ahs.tu-dortmund.de/angebote/aktueller_zeitraum/_Badminton.html"
    );

    //Store the ID of the original window
    const originalWindow = await driver.getWindowHandle();

    //Check we don't have other windows open already
    assert((await driver.getAllWindowHandles()).length === 1);

    // choose the right button according to the day of week
    // MUSS BE REPLACE WITH THE RIGHT XPATH IF YOU ENTER A NEW SPORT
    switch (new Date().getDay()) {
      //if monday
      case 1: {
        click(driver, '//*[@id="bs_trDFB6F6C0D3"]/td[9]/input');
        break;
      }
      //if tuesday
      case 2: {
        click(driver, '//*[@id="bs_trDFB6F6C0AC"]/td[9]/input');
        break;
      }
      //if thursday
      case 4: {
        click(driver, '//*[@id="bs_trDFB6F6C0E8"]/td[9]/input');
        break;
      }
      //if Friday
      case 5: {
        click(driver, '//*[@id="bs_trDFB6F60C0B"]/td[9]/input');
        break;
      }
      default: {
        await driver.quit();
        break;
      }
    }

    //Wait for the new window or tab
    await driver.wait(
      async () => (await driver.getAllWindowHandles()).length === 2,
      10000
    );

    //Loop through until we find a new window handle
    const windows = await driver.getAllWindowHandles();
    windows.forEach(async (handle) => {
      if (handle !== originalWindow) {
        await driver.switchTo().window(handle);
      }
    });

    //Wait for the new tab to finish loading content
    await driver.wait(until.titleIs("Anmeldung"), 5000);

    //chose booking with account
    await click(
      driver,
      '//*[@id="bs_form_main"]/div/div[2]/div[1]/label/div[2]/input'
    );

    const pathWithAccount = [
      // email input field
      '//*[@id="bs_pw_anm"]/div[2]/div[2]/input',
      //password input field
      '//*[@id="bs_pw_anm"]/div[3]/div[2]/input',
    ];

    click(driver, '//*[@id="bs_pw_anmlink"]/div[2]');
    // await driver
    //   .findElement(By.xpath('//*[@id="bs_pw_anmlink"]/div[2]'))
    //   .click();

    for (let i = 0; i < pathWithAccount.length; i++) {
      await driver
        .findElement(By.xpath(pathWithAccount[i]))
        .sendKeys(account[i]);
    }

    //submit form
    await click(driver, '//*[@id="bs_pw_anm"]/div[5]/div[1]/div[2]/input');

    // wait until all contents of the page is load
    await driver.wait(
      until.elementLocated(By.xpath('//*[@id="bs_bed"]/label/input'), 5000)
    );

    //click on agreement
    await click(driver, '//*[@id="bs_bed"]/label/input');

    //submit form
    await click(driver, '//*[@id="bs_submit"]');

    //book appointment
    await click(driver, '//*[@id="bs_foot"]/div[1]/div[2]/input');

    await driver.wait(until.titleIs("12"), 10000);
  } finally {
    await driver.quit();
  }
}

(async function book() {
  //list of accounts which do the booking
  const accounts = [
    // ["minhdan1405@gmail.com", "Minhdan1405@deutsch"],
    ["dangkhoa27031997@gmail.com", "B4byMet@l2703"],
  ];
  for (let account of accounts) {
    signUpBot(account);
  }
})();
