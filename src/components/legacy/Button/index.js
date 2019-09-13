// @flow

import React, { PureComponent } from "react";
import styled from "styled-components";
import ButtonBase from "@material-ui/core/ButtonBase";
import Box from "components/base/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import colors, { opacity } from "shared/colors";

type Variant = "text" | "outlined" | "filled";

type Size = "tiny" | "small" | "medium";

type Props = {
  type?: "submit" | "cancel",
  IconLeft?: React$ComponentType<*>,
  IconRight?: React$ComponentType<*>,
  customColor?: string,
  children: React$Node,
  onClick?: Function,
  variant: Variant,
  size: Size,
};

const COLORS_BY_TYPE = {
  submit: "primary",
  cancel: "secondary",
};

const SIZE_ICON_BY_TYPE = {
  tiny: 10,
  small: 16,
  medium: 23,
};

const MIN_HEIGHT_BY_SIZE = {
  tiny: 24,
  small: 40,
  medium: 42,
};

const FONTSIZE_BY_SIZE = {
  tiny: 9,
  small: 11,
  medium: 11,
};

const PADDING_BY_SIZE = {
  tiny: 2,
  small: 5,
  medium: 8,
};

const FLOW_BY_SIZE = {
  tiny: 4,
  small: 8,
  medium: 8,
};

const Loader = ({ color }: { color: string }) => (
  <CircularProgress color={color} size={16} style={{ position: "absolute" }} />
);
const getBgColor = (customColor, type, variant) => {
  if (variant === "outlined" || variant === "text") {
    return "default";
  }
  const color = (type && COLORS[type]) || customColor;
  return opacity(color, 0.1);
  // return "default";
};
const getHoverBG = (customColor, type) => {
  const color = (type && COLORS[type]) || customColor;
  return opacity(color, 0.2);
};

const COLORS = {
  submit: colors.ocean,
  cancel: colors.grenade,
};

const getColor = (type, color) => (type && COLORS[type]) || color || "default";

const ButtonDecorated = styled(({ isLoading, customColor, type, ...rest }) => (
  <ButtonBase {...rest} />
)).attrs((p: Props) => ({
  variant: p.variant,
  color: getColor(p.type, p.customColor),
}))`
  && {
    text-transform: uppercase;
    letter-spacing: 1px;
    border-radius: 3px;
    padding: ${p => PADDING_BY_SIZE[p.size]}px;
    padding-right: 10px;
    padding-left: 10px;
    min-height: ${p => MIN_HEIGHT_BY_SIZE[p.size]}px;
    font-size: ${p => FONTSIZE_BY_SIZE[p.size]}px;
    cursor: ${p => (p.isLoading ? "default" : "cursor")};
    pointer-events: ${p => (p.isLoading ? "none" : "default")};
    background-color: ${p => getBgColor(p.customColor, p.type, p.variant)};
    border: ${p => (p.variant === "outlined" ? "1px solid" : "0")};
    border-color: ${p => getColor(p.type, p.customColor)};
    color: ${p => getColor(p.type, p.customColor)};
    &:hover {
      background-color: ${p => getHoverBG(p.customColor, p.type)};
      border-color: ${p => (p.customColor ? p.customColor : "default")};

    }
    &:disabled {
      opacity: 0.3
    }
    &:focus {
      background-color: ${p => getHoverBG(p.customColor, p.type)};
    }
  }
}
`;
const Container = styled(Box)`
  opacity: ${p => (p.isLoading ? "0.1" : "1")};
`;

type State = {
  isLoading: boolean,
};
class VaultButton extends PureComponent<Props, State> {
  state = {
    isLoading: false,
  };

  static defaultProps = {
    variant: "outlined",
    size: "medium",
  };

  _unmounted = false;

  handleClick = () => {
    if (!this.props.onClick) return;
    this.setState({ isLoading: true });
    Promise.resolve()
      .then(this.props.onClick)
      .catch(e => e)
      .then(() => {
        if (this._unmounted) return;
        this.setState({ isLoading: false });
      });
  };

  componentWillUnmount() {
    this._unmounted = true;
  }

  render() {
    const {
      IconLeft,
      IconRight,
      type,
      children,
      variant,
      size,
      customColor,
      ...rest
    } = this.props;
    const { isLoading } = this.state;

    return (
      <ButtonDecorated
        type={type}
        variant={variant}
        isLoading={isLoading}
        customColor={customColor}
        size={size}
        {...rest}
        onClick={this.handleClick}
      >
        <Container
          horizontal
          align="center"
          flow={FLOW_BY_SIZE[size]}
          isLoading={isLoading}
        >
          {IconLeft && (
            <Box>
              <IconLeft size={SIZE_ICON_BY_TYPE[size]} />
            </Box>
          )}
          <Box style={{ whiteSpace: "nowrap" }}>{children}</Box>
          {IconRight && (
            <Box>
              <IconRight size={SIZE_ICON_BY_TYPE[size]} />
            </Box>
          )}
        </Container>
        {isLoading && (
          <Loader
            color={(type && COLORS_BY_TYPE[type]) || "inherit"}
            size={size}
          />
        )}
      </ButtonDecorated>
    );
  }
}

export default VaultButton;
