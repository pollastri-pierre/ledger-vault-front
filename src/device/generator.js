// @flow

import type { Seed } from "components/SoftDevices/SoftDevicesContext";
import sha256 from "crypto-js/sha256";
import hex from "crypto-js/enc-hex";

const bip39 = require("bip39");

export const generateSeeds = (salt: string, nb: number) => {
  const arr = [];
  for (let i = 0; i < nb; i++) {
    const entropy = hashCode(`${salt}_${i}`);
    arr.push(bip39.entropyToMnemonic(entropy.toString("hex")));
  }
  return arr;
};

export const hashCode = (str: string): Buffer => {
  return Buffer.from(hex.stringify(sha256(str)), "hex");
};

export const generateWorkspaceSeeds = (
  salt: string,
  onboarding: boolean,
): Seed[] => {
  const seeds = generateSeeds(salt, 17);
  const workspaceSeeds = [
    { name: "Admin 1", seed: seeds[0] },
    { name: "Admin 2", seed: seeds[1] },
    { name: "Admin 3", seed: seeds[2] },
    { name: "Operator 1", seed: seeds[3] },
    { name: "Operator 2", seed: seeds[4] },
    { name: "Operator 3", seed: seeds[5] },
    { name: "Operator 4", seed: seeds[6] },
    { name: "Operator 5", seed: seeds[7] },
    { name: "Operator 6", seed: seeds[8] },
    { name: "Operator 7", seed: seeds[9] },
    { name: "Operator 8", seed: seeds[10] },
  ];
  const onboardingSeeds = [
    { name: "Wrapping Key 1", seed: seeds[11] },
    { name: "Wrapping Key 2", seed: seeds[12] },
    { name: "Wrapping Key 3", seed: seeds[13] },
    { name: "Shared Owner 1", seed: seeds[14] },
    { name: "Shared Owner 2", seed: seeds[15] },
    { name: "Shared Owner 3", seed: seeds[16] },
  ];
  if (onboarding) {
    return [...workspaceSeeds, ...onboardingSeeds];
  }
  return workspaceSeeds;
};
