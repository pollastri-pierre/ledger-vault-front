// @flow

import React, { useEffect } from "react";
import styled from "styled-components";

import IconCheck from "../icons/Validate";
import IconError from "../icons/Error";
import colors from "../../shared/colors";

type AlertProp = {
  children: React$Node,
  open: boolean,
  type: string,
  title: React$Node,
  onClose: () => void,
};

const ICON_SIZE = 38;
const DISPLAY_DURATION = 4000;

const Alert = ({ children, open, type, title, onClose }: AlertProp) => {
  useEffect(() => {
    let timeOutId;

    if (open) {
      timeOutId = setTimeout(onClose, DISPLAY_DURATION);
    }

    return () => {
      clearTimeout(timeOutId);
    };
  }, [open, onClose]);

  return (
    <Container open={open} className="top-message" onClick={onClose}>
      <Content type={type}>
        <Icon>
          {type === "success" ? (
            <IconCheck color={colors.white} size={ICON_SIZE} />
          ) : (
            <IconError color={colors.white} size={ICON_SIZE} />
          )}
        </Icon>
        <div>
          <Title className="top-message-title">{title}</Title>

          <div className="top-message-body">{children}</div>
        </div>
      </Content>
    </Container>
  );
};

export default Alert;

const Container = styled.div`
  display: flex;
  position: absolute;
  transform: translateY(${(p) => (p.open ? "0" : "-110%")});
  transition: 300m s cubic-bezier(0.65, 0.09, 0.35, 1.41) transform;
  cursor: pointer;
`;

const Icon = styled.div`
  margin-right: 30px;
`;

const Content = styled.div`
  display: flex;
  border-radius: 5px;
  color: ${colors.white};
  background: ${(p) => (p.type === "error" ? colors.grenade : colors.ocean)};
  padding: 30px;
  padding-top: 40px;
  margin-top: -10px;
  line-height: 2;
  box-shadow: ${colors.shadows.material};
`;

const Title = styled.div`
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 10px;
`;
