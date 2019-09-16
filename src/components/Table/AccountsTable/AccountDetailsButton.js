// @flow

import React from "react";
import styled from "styled-components";
import { withRouter } from "react-router";
import { Trans } from "react-i18next";
import type { MemoryHistory } from "history";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import { FaEllipsisV } from "react-icons/fa";

import type { Account } from "data/types";

type Props = {
  account: Account,
  history: MemoryHistory,
};

function preventRowClick(e) {
  e.preventDefault();
  e.stopPropagation();
}

function AccountTableSubmenu(props: Props) {
  const { account, history } = props;

  const [anchorEl, setAnchorEl] = React.useState(null);

  function handleClick(e) {
    preventRowClick(e);
    setAnchorEl(e.currentTarget);
  }

  function handleOverview(e) {
    preventRowClick(e);
    setAnchorEl(null);
    history.push(`accounts/details/${account.id}/overview`);
  }
  function handleEdit(e) {
    preventRowClick(e);
    setAnchorEl(null);
    history.push(`${location.pathname}/accounts/edit/${account.id}`);
  }
  function handleCloseMenu(e) {
    preventRowClick(e);
    setAnchorEl(null);
  }

  return (
    <div>
      <Btn
        aria-controls={account.id}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <FaEllipsisV />
      </Btn>
      <Menu
        id={account.id}
        anchorEl={anchorEl}
        disableAutoFocusItem
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <StyledMenuItem onClick={handleOverview}>
          <Trans i18nKey="accountDetails:tableSubmenu.overview" />
        </StyledMenuItem>
        <StyledMenuItem onClick={handleEdit}>
          <Trans i18nKey="accountDetails:tableSubmenu.edit" />
        </StyledMenuItem>
      </Menu>
    </div>
  );
}

export default withRouter(AccountTableSubmenu);

const StyledMenuItem = styled(MenuItem)`
  && {
    font-size: 13px;
    &:hover {
      color: ${p => p.theme.colors.blue};
    }
  }
`;

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
