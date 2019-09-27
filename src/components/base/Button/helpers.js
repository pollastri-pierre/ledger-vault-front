// @flow

import colors, { opacity, lighten, darken, rgba } from "shared/colors";

import type { ButtonProps } from "./";

export function getBgByVariant(props: ButtonProps) {
  switch (props.variant) {
    case "primary":
      return colors.bLive;
    case "danger":
      return colors.grenade;
    case "warning":
      return colors.warning;
    case "info":
      return colors.mediumGrey;
    default:
      return colors.bLive;
  }
}

export function getColorByVariant(props: ButtonProps) {
  if (props.type === "outline") return getBgByVariant(props);
  switch (props.variant) {
    case "primary":
      return colors.white;
    case "danger":
      return colors.white;
    case "warning":
      return colors.argile;
    case "info":
      return colors.white;
    default:
      return colors.white;
  }
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
      background: ${opacity(getBgByVariant(p), 0.5)};
    `,
    focus: p => `
      box-shadow: 0 0 0 1px ${rgba(getBgByVariant(p), 0.5)} inset,
      0 0 0 1px ${rgba(getBgByVariant(p), 0.3)},
      0 0 0 2px ${rgba(getBgByVariant(p), 0.3)}`,
  },

  link: {
    default: p => `
      color: ${p.disabled ? colors.steel : getBgByVariant(p)};
    `,
    hover: p => `
      color: ${lighten(getBgByVariant(p), 0.1)};
     `,
    active: p => `
      color: ${darken(getBgByVariant(p), 0.1)};
     `,
  },
  outline: {
    default: p => `
      background: transparent;
      border: 1px solid ${getBgByVariant(p)};
      color: ${darken(getColorByVariant(p), 0.4)};
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
