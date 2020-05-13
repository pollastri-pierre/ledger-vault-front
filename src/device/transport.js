// @flow

// handle legacy localstorage
localStorage.removeItem("FORCE_WEB_USB");

// PREFERRED_TRANSPORT = webusb if no TRANSPORT is found in localstorage
let PREFERRED_TRANSPORT = localStorage.getItem("TRANSPORT") || "webusb";

if (window.config.ONLY_WEBLUE) {
  PREFERRED_TRANSPORT = "weblue";
}

localStorage.setItem("TRANSPORT", PREFERRED_TRANSPORT);

export const getPreferredTransport = () => PREFERRED_TRANSPORT;

export const setPreferredTransport = (transportID: string) => {
  PREFERRED_TRANSPORT = transportID;
  localStorage.setItem("TRANSPORT", PREFERRED_TRANSPORT);
};
