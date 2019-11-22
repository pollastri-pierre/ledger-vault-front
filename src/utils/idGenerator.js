// @flow

let _uniqueCounter = 1;
export const generateID = () => ++_uniqueCounter;
