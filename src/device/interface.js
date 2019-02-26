import {
  getPublicKey as softGetPublicKey,
  authenticate as softAuthenticate
} from "device/VaultDeviceHTTP";
import {
  getPublicKey as hardGetPublicKey,
  authenticate as hardAuthenticate
} from "device/VaultDeviceApp";

const softwareMode = () =>
  process.env.NODE_ENV === "e2e" || window.config.SOFTWARE_DEVICE;

export const getPublicKey = () =>
  softwareMode() ? softGetPublicKey : hardGetPublicKey;

export const authenticate = () =>
  softwareMode() ? softAuthenticate : hardAuthenticate;
