// @flow

import web3utils from "web3-utils";

export const isChecksumAddress = (address: string) =>
  address === toCheckSumAddress(address);

export const toCheckSumAddress = (address: string) => {
  try {
    return web3utils.toChecksumAddress(address);
  } catch (err) {
    return "";
  }
};
