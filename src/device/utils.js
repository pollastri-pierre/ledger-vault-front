// @flow

export const fromStringRoleToBytes = {
  shared_owner: Buffer.from([2]),
  admin: Buffer.from([1]),
  operator: Buffer.from([0]),
};
