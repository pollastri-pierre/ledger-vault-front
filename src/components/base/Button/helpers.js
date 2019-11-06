// @flow

import colors, { opacity, darken, rgba } from "shared/colors";

import type { ButtonProps } from "./";

const bgByVariant = {
  primary: colors.bLive,
  danger: colors.grenade,
  warning: colors.warning,
  info: colors.mediumGrey,
};
export function getBgByVariant({ variant }: ButtonProps) {
  return (variant && bgByVariant[variant]) || colors.bLive;
}

const colorByVariant = {
  primary: colors.white,
  danger: colors.white,
  warning: colors.argile,
  info: colors.white,
};
export function getColorByVariant(props: ButtonProps) {
  if (props.type === "outline") return getBgByVariant(props);
  return (props.variant && colorByVariant[props.variant]) || colors.white;
}
const fontSizeBySize = {
  tiny: 9,
  small: 11,
  slim: 11,
};
export function getFontSize({ size }: ButtonProps) {
  return (size && fontSizeBySize[size]) || 13;
}

const buttonHeightBySize = {
  tiny: 20,
  small: 30,
  slim: 34,
};
export function getButtonHeight({ size, circular }: ButtonProps) {
  if (circular) {
    return "inherit";
  }
  return (size && buttonHeightBySize[size]) || 40;
}

const buttonPaddingX = {
  tiny: 13,
  small: 16,
  slim: 25,
};
export function getPaddingX({ size, circular }: ButtonProps) {
  if (circular) {
    return 12;
  }
  return (size && buttonPaddingX[size]) || 25;
}

const buttonPaddingY = {
  tiny: 3,
  small: 5,
  slim: 8,
};
export function getPaddingY({ size, circular }: ButtonProps) {
  if (circular) {
    return 12;
  }
  return (size && buttonPaddingY[size]) || 8;
}

const loaderBySize = {
  tiny: 9,
  small: 12,
  slim: 16,
};
export function getLoaderSize({ size }: ButtonProps) {
  return (size && loaderBySize[size]) || 16;
}

export function getStyles(props: ButtonProps, state: string) {
  let output = ``;
  let hasModifier = false;
  for (const s in buttonStyles) {
    if (
      Object.prototype.hasOwnProperty.call(buttonStyles, s) &&
      props.type === s
    ) {
      const style = buttonStyles[s][state];
      if (style) {
        hasModifier = true;
        output += style(props);
      }
    }
  }
  if (!hasModifier) {
    const defaultStyle = buttonStyles.default[state];
    if (defaultStyle) {
      output += defaultStyle(props) || "";
    }
  }
  return output;
}

const buttonStyles: { [_: string]: Object } = {
  filled: {
    default: p => `
      background: ${
        p.disabled ? `${colors.cream} !important` : getBgByVariant(p)
      };
      color: ${p.disabled ? colors.mediumGrey : getColorByVariant(p)}
    `,
    active: p => `
      background: ${darken(getBgByVariant(p), 0.1)};
    `,
    hover: p => `
      background: ${darken(getBgByVariant(p), 0.05)};
    `,
    focus: p => `
      box-shadow: 0 0 0 1px ${darken(getBgByVariant(p), 0.2)} inset,
      0 0 0 1px ${rgba(getBgByVariant(p), 0.3)},
      0 0 0 2px ${rgba(getBgByVariant(p), 0.3)}`,
  },

  link: {
    default: p => `
      color: ${p.disabled ? colors.steel : getBgByVariant(p)};
    `,
    hover: p => `
      color: ${darken(getBgByVariant(p), 0.1)};
      background: ${opacity(getBgByVariant(p), 0.05)};
     `,
    active: p => `
      color: ${darken(getBgByVariant(p), 0.1)};
      background: ${opacity(getBgByVariant(p), 0.1)};
     `,
  },
  outline: {
    default: p => `
      background: transparent;
      border: 2px solid ${getBgByVariant(p)};
      color: ${getColorByVariant(p)};
    `,
    hover: p => `
      background: ${rgba(getBgByVariant(p), 0.1)};
    `,
    focus: p => `
      box-shadow: 0 0 0 3px ${rgba(getBgByVariant(p), 0.3)};
    `,
    active: p => `
      background: ${rgba(getBgByVariant(p), 0.15)};
      color: ${darken(getColorByVariant(p), 0.1)};
      border-color: ${darken(getBgByVariant(p), 0.1)};
    `,
  },

  default: {
    default: () => ``,
    active: () => `
      background: ${opacity(colors.argile, 0.8)};
    `,
    hover: () => `
      background: ${opacity(colors.argile, 0.5)};
    `,
    focus: () => `
      box-shadow: 0 0 0 1px ${rgba(colors.argile, 0.5)} inset,
      0 0 0 1px ${rgba(colors.argile, 0.3)},
      0 0 0 2px ${rgba(colors.argile, 0.3)}`,
  },
};
