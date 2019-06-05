var inquirer = require("inquirer");
var axios = require("axios");
const URL_DEVICE_API = "http://localhost:5001";

const updateDevice = async device => {
  try {
    await axios({
      method: "POST",
      url: `${URL_DEVICE_API}/switch-device`,
      data: {
        device_number: device,
      },
    });
    console.log("OK ✔");
  } catch (e) {
    console.error(e);
  }
};
if (process.argv[2]) {
  updateDevice(process.argv[2]);
} else {
  const device_number = {
    type: "list",
    name: "device_number",
    message: "Select a device",
    default: "1",
    choices: [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
      "16",
      "17",
      "18",
      "19",
      "20",
      "21",
      "22",
    ],
  };
  inquirer.prompt([device_number]).then(async answers => {
    await updateDevice(answers.device_number);
  });
}
