// @flow

import React from "react";
import styled from "styled-components";
import { withRouter } from "react-router";
import type { MemoryHistory } from "history";
import { FaWrench } from "react-icons/fa";

import type { Account } from "data/types";

type Props = {
  account: Account,
  history: MemoryHistory,
};

function AccountDetailsButton(props: Props) {
  const { account, history } = props;
  const onClick = e => {
    // prevent click on row
    e.preventDefault();
    e.stopPropagation();
    // navigate to details
    history.push(`accounts/details/${account.id}/overview`);
  };
  return (
    <Btn onClick={onClick}>
      <FaWrench />
    </Btn>
  );
}

const Btn = styled.div`
  height: 40px;
  width: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${p => p.theme.colors.mediumGrey};

  &:hover {
    color: ${p => p.theme.colors.shark};
  }
`;

export default withRouter(AccountDetailsButton);
