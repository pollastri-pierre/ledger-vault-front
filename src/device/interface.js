import {
  getPublicKey as softGetPublicKey,
  authenticate as softAuthenticate,
  register as softRegister,
  getAttestationCertificate as softGetAttestationCertificate,
  validateVaultOperation as softValidateVaultOperation,
  generateKeyComponent as softGenerateKeyComponent,
  getVersion as softGetVersion,
  openSession as softOpenSession,
  registerData as softRegisterData,
  getFirmwareInfo as softGetFirmwareInfo,
} from "device/VaultDeviceHTTP";

import {
  getPublicKey as hardGetPublicKey,
  authenticate as hardAuthenticate,
  register as hardRegister,
  getAttestationCertificate as hardGetAttestationCertificate,
  validateVaultOperation as hardValidateVaultOperation,
  getVersion as hardGetVersion,
  openSession as hardOpenSession,
  generateKeyComponent as hardGenerateKeyComponent,
  getFirmwareInfo as hardGetFirmwareInfo,
  registerData as hardRegisterData,
} from "device/VaultDeviceApp";

export const softwareMode = () => {
  return (
    (process.env.NODE_ENV === "e2e" ||
      localStorage.getItem("ENABLE_SOFTWARE")) &&
    // this || condition is useful for e2e test where localstorage does not exist
    (localStorage.getItem("TRANSPORT") === "software" ||
      !localStorage.getItem("TRANSPORT"))
  );
};

export const getPublicKey = () =>
  softwareMode() ? softGetPublicKey : hardGetPublicKey;

export const authenticate = () =>
  softwareMode() ? softAuthenticate : hardAuthenticate;

export const register = () => (softwareMode() ? softRegister : hardRegister);

export const registerData = () =>
  softwareMode() ? softRegisterData : hardRegisterData;

export const getAttestationCertificate = () =>
  softwareMode()
    ? softGetAttestationCertificate
    : hardGetAttestationCertificate;

export const openSession = () =>
  softwareMode() ? softOpenSession : hardOpenSession;

export const validateVaultOperation = () =>
  softwareMode() ? softValidateVaultOperation : hardValidateVaultOperation;

export const generateKeyComponent = () =>
  softwareMode() ? softGenerateKeyComponent : hardGenerateKeyComponent;

export const getVersion = () =>
  softwareMode() ? softGetVersion : hardGetVersion;

export const getFirmwareInfo = () =>
  softwareMode() ? softGetFirmwareInfo : hardGetFirmwareInfo;
