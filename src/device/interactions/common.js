// @flow
import React from "react";
import type { Interaction } from "components/DeviceInteraction";
import Text from "components/base/Text";
import {
  U2F_PATH,
  CONFIDENTIALITY_PATH,
  VALIDATION_PATH,
  KEY_MATERIAL_PATH,
} from "device";
import { OutOfDateApp } from "utils/errors";
import {
  getPublicKey,
  getVersion,
  getAttestationCertificate,
  generateKeyComponent,
} from "device/interface";

export const getU2FPublicKey: Interaction = {
  needsUserInput: false,
  device: true,
  responseKey: "u2f_key",
  tooltip: <Text small i18nKey="common:plug_device" />,
  action: ({ transport }) => getPublicKey()(transport, U2F_PATH, false),
};

export const checkVersion: Interaction = {
  needsUserInput: false,
  device: true,
  responseKey: "get_version",
  tooltip: <Text small i18nKey="common:plug_device" />,
  action: ({ transport }) => {
    const promise = new Promise((resolve, reject) => {
      getVersion()(transport).then(version => {
        console.log(`Blue app version is ${version.appVersion}`); // eslint-disable-line no-console
        console.log(`Config app version is ${window.config.APP_VERSION}`); // eslint-disable-line no-console
        if (version.appVersion !== window.config.APP_VERSION) {
          reject(new OutOfDateApp());
        } else {
          resolve(version);
        }
      });
    });
    return promise;
  },
};

export const getConfidentialityPublicKey: Interaction = {
  needsUserInput: false,
  device: true,
  responseKey: "confidentiality_key",
  action: ({ transport }) => getPublicKey()(transport, CONFIDENTIALITY_PATH),
};

export const getValidationPublicKey: Interaction = {
  needsUserInput: false,
  device: true,
  responseKey: "validation_key",
  action: ({ transport }) => getPublicKey()(transport, VALIDATION_PATH),
};

export const getAttestation: Interaction = {
  needsUserInput: false,
  device: true,
  responseKey: "attestation",
  action: ({ transport }) => getAttestationCertificate()(transport),
};

export const generateWrappingKey: Interaction = {
  needsUserInput: true,
  device: true,
  responseKey: "blob",
  action: ({ transport }) =>
    generateKeyComponent()(transport, KEY_MATERIAL_PATH, true),
};

export const generateFragmentSeed: Interaction = {
  needsUserInput: true,
  device: true,
  responseKey: "blob",
  action: ({ transport }) =>
    generateKeyComponent()(transport, KEY_MATERIAL_PATH),
};
