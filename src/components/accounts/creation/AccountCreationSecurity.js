// @flow

import React from "react";
import { translate } from "react-i18next";
import { withStyles } from "@material-ui/core/styles";

import type { State as AccountCreationState } from "redux/modules/account-creation";
import type { Translate } from "data/types";

import SecurityRow from "../../SecurityRow";
import ValidateBadge from "../../icons/full/ValidateBadge";
import PeopleFull from "../../icons/full/People";

const styles = {
  base: {
    "& h4": {
      fontSize: "11px",
      fontWeight: "600",
      textTransform: "uppercase",
      marginTop: "3px",
      marginBottom: "29px"
    },
    "& h5": {
      fontSize: "10px",
      fontWeight: "600",
      color: "#999",
      marginBottom: "10px",
      textTransform: "uppercase"
    }
  },
  icon: {
    fill: "#e2e2e2",
    width: 13
  }
};

type Props = {
  accountCreationState: AccountCreationState,
  switchInternalModal: Function,
  t: Translate,
  classes: Object
};

function AccountCreationSecurity(props: Props) {
  const { accountCreationState, switchInternalModal, classes, t } = props;
  return (
    <div className={classes.base}>
      <h4>{t("newAccount:security.scheme")}</h4>
      <h5>{t("newAccount:security.account_members")}</h5>
      <div className="security-members">
        <SecurityRow
          icon={<PeopleFull className={classes.icon} />}
          label={t("newAccount:security.members")}
          onClick={() => switchInternalModal("members")}
        >
          {accountCreationState.approvers.length > 0
            ? `${accountCreationState.approvers.length} selected`
            : t("common:none")}
        </SecurityRow>
        <SecurityRow
          icon={<ValidateBadge className={classes.icon} />}
          label={t("newAccount:security.approvals")}
          disabled={accountCreationState.approvers.length === 0}
          onClick={() => switchInternalModal("approvals")}
        >
          {accountCreationState.quorum > 0
            ? `${accountCreationState.quorum} required`
            : t("common:none")}
        </SecurityRow>
      </div>
    </div>
  );
}

export default withStyles(styles)(translate()(AccountCreationSecurity));
