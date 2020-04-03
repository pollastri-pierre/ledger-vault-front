// @flow
import React from "react";
import styled from "styled-components";
import colors from "shared/colors";
import People from "components/icons/thin/People";
import Plus from "components/icons/full/Plus";
import Profile from "components/icons/thin/Profile";

export const Careful = ({ children }: { children: React$Node }) => (
  <CarefulContainer>
    <CarefulIcon>!</CarefulIcon>
    <div> {children}</div>
  </CarefulContainer>
);

const CarefulIcon = styled.div`
  width: 20px;
  color: ${colors.white};
  height: 20px;
  border-radius: 50%;
  text-align: center;
  font-weight: bold;
  margin-right: 15px;
  background: ${colors.ocean};
`;

const CarefulContainer = styled.div`
  padding: 10px;
  background: ${colors.legacyLightBlue};
  margin-top: 20px;
  align-items: center;
  font-weight: bold;
  color: ${colors.legacyBlue};
  border-radius: 4px;
  display: flex;
`;

type AddUserProps = {
  onClick: () => void,
  children: React$Node,
};

export const AddUser = ({ onClick, children }: AddUserProps) => (
  <AddUserContainer onClick={onClick}>
    <Plus style={{ width: 11, marginRight: 10, verticalAlign: "middle" }} />
    <span>{children}</span>
  </AddUserContainer>
);

const AddUserContainer = styled.div`
  color: ${colors.ocean};
  text-decoration: none;
  text-transform: uppercase;
  font-size: 11px;
  font-weight: 600;
  position: absolute;
  cursor: pointer;
  top: 8px;
  right: 0;
  display: flex;
  align-items: center;
`;

export const NoMembers = ({ label, info }: { label: *, info: * }) => (
  <NoMembersContainer>
    <People
      color={colors.legacyGrey}
      style={{ height: 29, display: "block", margin: "auto", marginBottom: 21 }}
    />
    <NoMembersLabel>{label}</NoMembersLabel>
    <NoMembersInfo>{info}</NoMembersInfo>
  </NoMembersContainer>
);

const NoMembersInfo = styled.div`
  font-size: 11px;
  text-align: center;
  line-height: 1.82;
  margin: 0;
`;

const NoMembersLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  margin: 0;
  margin-bottom: 5px;
  text-align: center;
  text-transform: uppercase;
`;

const NoMembersContainer = styled.div`
  font-size: 11px;
  line-height: 1.82;
  text-align: center;
  width: 264px;
  margin: auto;
  margin-top: 110;
`;

export const ProfileIcon = () => (
  <div style={{ marginBottom: 10 }}>
    <Profile color={colors.legacyGrey} style={{ width: 28 }} />
  </div>
);

type StepProps = {
  label: string,
  active: boolean,
  className?: string,
};

export const Step = ({ className, label, active }: StepProps) => (
  <StepContainer className={className} active={active}>
    {label}
  </StepContainer>
);

const StepContainer = styled.div`
  font-size: 13px;
  color: ${p => (p.active ? colors.black : colors.steel)};
  padding: 15px 0 15px 0;
  border-bottom: 1px solid ${colors.argile};
  &:last-child {
    border: 0;
    ${p =>
      p.active
        ? `
      content: "";
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: ${colors.ocean};
      display: inline-block;
      margin-right: 10px;
      vertical-align: middle;
    `
        : ""}
  }
`;

type ListItemProps = {
  children: React$Node,
  number?: number,
};

export const ListItem = ({ children, number }: ListItemProps) => (
  <ListItemContainer>
    {number && <ListItemNumber>{number}.</ListItemNumber>}
    <span>{children}</span>
  </ListItemContainer>
);

const ListItemNumber = styled.span`
  font-size: 16px;
  margin: 0 15px 15px 0;
`;

const ListItemContainer = styled.li`
  font-size: 13px;
  line-height: 1.54;
  padding: 0;
  margin: 0;
  list-style-type: none;
  display: flex;
  position: relative;
  padding-bottom: 15px;
  padding-top: 15px;
  &:after {
    height: 1px;
    width: 100%;
    background-color: ${colors.argile};
    position: absolute;
    content: "";
    bottom: 0;
  }
  &:first-child {
    padding-top: 0;
  }
  &:last-child:after {
    display: none;
  }
  & a {
    text-decoration: none;
    text-transform: uppercase;
    font-size: 12px;
    font-weight: 600;
    color: ${colors.ocean};
  }
`;

export const List = styled.ul`
  margin: 0;
  padding: 0;
  marginbottom: 30px;
`;

export const Title = styled.h2`
  font-size: 18px;
  letter-spacing: -0.2px;
  font-weight: bold;
  margin: 8px 0 30px 0;
`;

export const Introduction = styled.p`
  font-size: 13px;
  line-height: 1.52;
  margin: 0 0 30px 0;
  & strong {
    font-weight: 600;
  }
`;

export const SubTitle = styled.span`
  font-size: 11px;
  font-weight: 600;
  display: block;
  text-transform: uppercase;
  margin: 0 0 22px 0;
`;
