// @flow
import React from "react";
import styled from "styled-components";

const Li = styled.li`
  font-size: 13px;
  line-height: 1.54px;
`;

const Number = styled.span`
  font-size: 16px;
`;
const ListItem = ({ children, number }: { children: any, number: number }) => (
  <Li>
    <Number>{number}.</Number>
    <span>{children}</span>
  </Li>
);

export default ListItem;
