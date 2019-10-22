// @flow

import type { TextProps } from "./";

const fontSizeBySize = {
  tiny: 9,
  small: 11,
  normal: 13,
  large: 16,
  header: 18,
};
export function getFontSize({ size }: TextProps) {
  return (size && fontSizeBySize[size]) || "inherit";
}

const fontWeightByFontWeight = {
  bold: "bold",
  semiBold: 600,
};

export function getFontWeight({ fontWeight }: TextProps) {
  return (fontWeight && fontWeightByFontWeight[fontWeight]) || "inherit";
}
