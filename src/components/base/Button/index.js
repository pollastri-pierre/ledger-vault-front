// @flow

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { space, color } from "styled-system";
import Loader from "components/base/Loader";
import colors, { opacity, lighten, darken, rgba } from "shared/colors";
import Box from "components/base/Box";

type ButtonType = "primary" | "outline" | "link" | "danger";

type Props = {
  children?: React$Node,
  type?: ButtonType,
  primary?: boolean,
  danger?: boolean,
  disabled?: boolean,
  isFocused?: boolean,
  onClick?: Function,
  small?: boolean,
  circular?: boolean,
};

const buttonStyles: { [_: string]: Object } = {
  default: {
    default: p => `
    box-shadow: ${
      p.isFocused
        ? `
      0 0 0 1px ${rgba(colors.bLive, 0.5)} inset,
      0 0 0 1px ${rgba(colors.bLive, 0.3)},
      0 0 0 2px ${rgba(colors.bLive, 0.3)}
      `
        : ""
    }
    `,
    active: () => `
      background: ${opacity(colors.argile, 0.8)};
    `,
    hover: () => `
      background: ${opacity(colors.argile, 0.5)};
    `,
  },
  primary: {
    default: p => `
      background: ${p.disabled ? `${colors.argile} !important` : colors.bLive};
      color: ${p.disabled ? colors.shark : colors.white};
      box-shadow: ${
        p.isFocused
          ? `
        0 0 0 1px ${darken(colors.bLive, 0.3)} inset,
        0 0 0 1px ${rgba(colors.bLive, 0.5)},
        0 0 0 2px ${rgba(colors.bLive, 0.3)};`
          : ""
      }
    `,
    hover: () => `
       background: ${lighten(colors.bLive, 0.1)};
     `,
    active: () => `
       background: ${darken(colors.bLive, 0.1)};
     `,
  },
  danger: {
    default: p => `
      background: ${
        p.disabled ? `${colors.argile} !important` : colors.grenade
      };
      color: ${p.disabled ? colors.shark : colors.white};
      box-shadow: ${
        p.isFocused
          ? `
              0 0 0 1px ${darken(colors.grenade, 0.3)} inset,
              0 0 0 1px ${rgba(colors.grenade, 0.5)},
              0 0 0 3px ${rgba(colors.grenade, 0.3)};
            `
          : ""
      }
    `,
    hover: () => `
    background: ${lighten(colors.grenade, 0.1)};
     `,
    active: () => `
    background: ${darken(colors.grenade, 0.1)};
     `,
  },
  outline: {
    default: p => {
      const c = p.outlineColor
        ? colors[p.outlineColor] || p.outlineColor
        : colors.bLive;
      return `
        background: transparent;
        border: 1px solid ${c};
        color: ${c};
        box-shadow: ${
          p.isFocused
            ? `
            0 0 0 3px ${rgba(c, 0.3)};`
            : ""
        }
      `;
    },
    hover: p => {
      const c = p.outlineColor
        ? colors[p.outlineColor] || p.outlineColor
        : colors.bLive;
      return `
        background: ${rgba(c, 0.1)};
      `;
    },
    active: p => {
      const c = p.outlineColor
        ? colors[p.outlineColor] || p.outlineColor
        : colors.bLive;
      return `
        background: ${rgba(c, 0.15)};
        color: ${darken(
          p.outlineColor
            ? colors[p.outlineColor] || p.outlineColor
            : colors.bLive,
          0.1,
        )};
        border-color: ${darken(
          p.outlineColor
            ? colors[p.outlineColor] || p.outlineColor
            : colors.bLive,
          0.1,
        )};
      `;
    },
  },
  link: {
    default: p => `
      color: ${p.disabled ? colors.steel : colors.shark};
    `,
    hover: () => `
    color: ${lighten(colors.bLive, 0.1)};
     `,
    active: () => `
    color: ${darken(colors.bLive, 0.1)};
     `,
  },
};
function getStyles(props, state) {
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

export const ButtonBase = styled.div.attrs({
  px: p => (p.circular ? 12 : p.small ? 16 : 25),
  py: p => (p.circular ? 12 : p.small ? 5 : 8),
  color: "grey",
  bg: "transparent",
  tabIndex: 0,
})`
  ${space};
  ${color};
  font-size: ${p => p.fontSize || (p.small ? "9px" : "11px")};
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: ${p => (p.circular ? "50%" : "5px")};
  cursor: ${p => (p.disabled ? "not-allowed" : "pointer")};
  pointer-events: ${p => (p.disabled || p.isLoading ? "none" : "auto")};
  text-decoration: ${p => (p.link ? "underline" : "none")};
  outline: none;
  height: ${p => (!p.circular ? (p.small ? "30px" : "40px") : "inherit")};

  ${p => getStyles(p, "default")};

  &:hover {
    ${p => getStyles(p, "hover")};
  }
  &:active {
    ${p => getStyles(p, "active")};
  }
`;

export default function Button(props: Props) {
  const { onClick, children, small, ...rest } = props;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return () => {
      console.log("cleaned up"); // eslint-disable-line no-console
    };
  }, []);

  const handleClick = () => {
    if (!onClick) return;
    setIsLoading(true);
    Promise.resolve()
      .then(onClick)
      .catch(e => e)
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <ButtonBase
      {...rest}
      small={small}
      isLoading={isLoading}
      onClick={handleClick}
    >
      <Container isLoading={isLoading}>{children}</Container>
      {isLoading && (
        <Loader size={small ? 12 : 16} style={{ position: "absolute" }} />
      )}
    </ButtonBase>
  );
}

const Container = styled(Box)`
  opacity: ${p => (p.isLoading ? "0.1" : "1")};
`;
