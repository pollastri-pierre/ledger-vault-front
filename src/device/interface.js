import {
  getPublicKey as softGetPublicKey,
  authenticate as softAuthenticate,
  register as softRegister,
  getAttestationCertificate as softGetAttestationCertificate,
  validateVaultOperation as softValidateVaultOperation,
  openSession as softOpenSession,
} from "device/VaultDeviceHTTP";

import {
  getPublicKey as hardGetPublicKey,
  authenticate as hardAuthenticate,
  register as hardRegister,
  getAttestationCertificate as hardGetAttestationCertificate,
  validateVaultOperation as hardValidateVaultOperation,
  openSession as hardOpenSession,
} from "device/VaultDeviceApp";

const softwareMode = () =>
  process.env.NODE_ENV === "e2e" || window.config.SOFTWARE_DEVICE;

export const getPublicKey = () =>
  softwareMode() ? softGetPublicKey : hardGetPublicKey;

export const authenticate = () =>
  softwareMode() ? softAuthenticate : hardAuthenticate;

export const register = () => (softwareMode() ? softRegister : hardRegister);

export const getAttestationCertificate = () =>
  softwareMode()
    ? softGetAttestationCertificate
    : hardGetAttestationCertificate;

export const openSession = () =>
  softwareMode() ? softOpenSession : hardOpenSession;

export const validateVaultOperation = () =>
  softwareMode() ? softValidateVaultOperation : hardValidateVaultOperation;
