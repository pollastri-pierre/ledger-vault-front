// @flow

import type { Unit } from "@ledgerhq/live-common/lib/types";

const numbers = "0123456789";
export const sanitizeValueString = (
  unit: Unit,
  valueString: string,
): {
  display: string,
  value: string,
} => {
  let display = "";
  let value = "";
  let decimals = -1;
  for (let i = 0; i < valueString.length; i++) {
    const c = valueString[i];
    if (numbers.indexOf(c) !== -1) {
      if (decimals >= 0) {
        decimals++;
        if (decimals > unit.magnitude) break;
        value += c;
        display += c;
      } else if (value !== "0") {
        value += c;
        display += c;
      }
    } else if (decimals === -1 && (c === "," || c === ".")) {
      if (i === 0) display = "0";
      decimals = 0;
      display += ".";
    }
  }
  for (let i = Math.max(0, decimals); i < unit.magnitude; ++i) {
    value += "0";
  }
  if (!value) value = "0";
  return { display, value };
};
