// @flow

import React from "react";
import { withRouter } from "react-router";
import { useTranslation } from "react-i18next";
import { FaEllipsisV } from "react-icons/fa";
import type { MemoryHistory } from "history";

import {
  Menu,
  MenuButtonStyleIcon,
  MenuListStyle,
  MenuItemStyle,
} from "components/base/Menu";
import { hasPendingRequest } from "utils/entities";
import { OpenExternal } from "components/Table/TableBase";
import Box from "components/base/Box";
import { EDIT_ALLOWED_STATUS } from "components/EntityModal";
import type { Account } from "data/types";
import { useMe } from "components/UserContextProvider";

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
  const { t } = useTranslation();

  function handleOverview() {
    history.push(`accounts/details/${account.id}/overview`);
  }
  function handleEdit() {
    history.push(`${location.pathname}/accounts/edit/${account.id}`);
  }

  const me = useMe();
  const hasPendingReq = hasPendingRequest(account);

  const isAbleToEdit =
    me.role === "ADMIN" &&
    EDIT_ALLOWED_STATUS.indexOf(account.status) > -1 &&
    !hasPendingReq;

  return (
    <Box horizontal>
      <OpenExternal url={`/accounts/view/${account.id}`} />
      <Menu>
        <MenuButtonStyleIcon onClick={(e) => preventRowClick(e)}>
          <FaEllipsisV />
        </MenuButtonStyleIcon>
        <MenuListStyle>
          <MenuItemStyle onSelect={handleOverview}>
            {t("accountDetails:tableSubmenu.overview")}
          </MenuItemStyle>
          {isAbleToEdit && (
            <MenuItemStyle onSelect={handleEdit}>
              {t("accountDetails:tableSubmenu.edit")}
            </MenuItemStyle>
          )}
        </MenuListStyle>
      </Menu>
    </Box>
  );
}

export default withRouter(AccountTableSubmenu);
