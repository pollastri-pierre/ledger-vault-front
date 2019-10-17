// @flow

import React, { PureComponent } from "react";
import styled from "styled-components";

import Warning from "components/icons/TriangleWarning";
import Box from "components/base/Box";
import InfoCircle from "components/icons/InfoCircle";

import colors, { opacity, darken } from "shared/colors";

type InfoBoxType = "info" | "warning" | "error" | "success";

type Props = {
  type: InfoBoxType,
  Footer?: *,
  withIcon?: boolean,
  alignCenter?: boolean,
  children: *,
};

const Container = styled(Box).attrs({})`
  border-radius: 4px;
  color: ${colors.legacyDarkGrey3};
  align-items: ${p => (p.alignCenter ? "center" : "default")};
  justify-content: ${p => (p.alignCenter ? "center" : "default")};
  & a {
    text-decoration: underline;
  }
  color: ${p =>
    p.type === "info"
      ? darken(colors.ocean, 0.3)
      : p.type === "warning"
      ? colors.light_orange
      : p.type === "error"
      ? colors.grenade
      : p.type === "success"
      ? colors.green
      : "black"};
  background-color: ${p =>
    p.type === "info"
      ? opacity(colors.ocean, 0.05)
      : p.type === "warning"
      ? opacity(colors.blue_orange, 0.1)
      : p.type === "error"
      ? opacity(colors.grenade, 0.05)
      : p.type === "success"
      ? opacity(colors.green, 0.1)
      : "white"};
`;

const FooterContainer = styled(Box).attrs({
  align: "flex-end",
  p: 5,
})`
  background: rgba(0, 0, 0, 0.1);
  background-color: ${p =>
    p.type === "info"
      ? opacity(colors.ocean, 0.1)
      : p.type === "warning"
      ? opacity(colors.blue_orange, 0.1)
      : p.type === "error"
      ? opacity(colors.grenade, 0.05)
      : colors.white};
`;

const IconContainer = styled(Box).attrs({
  noShrink: true,
  pl: 10,
  pt: 12,
  justify: "center",
})`
  line-height: 0;
  color: ${p =>
    p.type === "info"
      ? opacity(darken(colors.ocean, 0.3), 0.3)
      : p.type === "warning"
      ? opacity(colors.light_orange, 0.4)
      : p.type === "success"
      ? opacity(colors.green, 0.6)
      : p.type === "error"
      ? opacity(colors.grenade, 0.6)
      : colors.white};
`;
class InfoBox extends PureComponent<Props> {
  renderIcon = () => {
    const { type } = this.props;
    let icon;
    if (type === "warning" || type === "error") {
      icon = <Warning width={20} height={20} />;
    } else if (type === "info" || type === "success") {
      icon = <InfoCircle size={20} />;
    }
    if (!icon) return null;
    return <IconContainer type={type}>{icon}</IconContainer>;
  };

  render() {
    const {
      children,
      type,
      Footer,
      withIcon,
      alignCenter,
      ...props
    } = this.props;
    return (
      <Container type={type} alignCenter={alignCenter} {...props}>
        <Box horizontal align="flex-start">
          {withIcon && this.renderIcon()}
          <Box p={10} style={{ textAlign: alignCenter ? "center" : "left" }}>
            {children}
          </Box>
        </Box>
        {Footer && <FooterContainer type={type}>{Footer}</FooterContainer>}
      </Container>
    );
  }
}

export default InfoBox;
