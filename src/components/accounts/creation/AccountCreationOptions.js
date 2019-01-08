//@flow
import { translate } from "react-i18next";
import React, { Fragment, PureComponent } from "react";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";

import type { Translate } from "data/types";
import type {
  State as AccountCreationState,
  UpdateState as UpdateAccountCreationState
} from "redux/modules/account-creation";

import BadgeCurrency from "../../BadgeCurrency";

const styles = {
  title: {
    fontSize: 11,
    fontWeight: 600,
    textTransform: "uppercase",
    marginBottom: 20,
    display: "block"
  },
  relative: {
    position: "relative"
  },
  badge: {
    position: "absolute",
    left: 0,
    top: "29%"
  },
  input: {
    paddingLeft: 20,
    color: "black",
    paddingBottom: 10
  }
};

type Props = {
  accountCreationState: AccountCreationState,
  updateAccountCreationState: UpdateAccountCreationState,

  classes: { [_: $Keys<typeof styles>]: string },
  t: Translate
};

class AccountCreationOptions extends PureComponent<Props> {
  handleChangeName = (name: string) => {
    const { updateAccountCreationState } = this.props;
    updateAccountCreationState(() => ({ name }));
  };

  handleChangeParentAccountName = (name: string) => {
    const { updateAccountCreationState } = this.props;
    updateAccountCreationState(() => ({ parent_account: { name } }));
  };

  renderCurrency = () => {
    const { classes, t, accountCreationState } = this.props;
    const { currency } = accountCreationState;
    if (!currency) return null;
    return (
      <Fragment>
        <BadgeCurrency currency={currency} className={classes.badge} />
        <TextField
          value={accountCreationState.name}
          autoFocus
          onChange={e => this.handleChangeName(e.target.value)}
          placeholder={t("newAccount:options.acc_name_placeholder")}
          InputProps={{ className: classes.input }}
          fullWidth
        />
      </Fragment>
    );
  };

  renderERC20Token = () => {
    const { classes, t, accountCreationState } = this.props;
    const { erc20token } = accountCreationState;
    if (!erc20token) return null;

    const parentAccountName = accountCreationState.parent_account
      ? accountCreationState.parent_account.name || ""
      : "";

    return (
      <Fragment>
        <TextField
          value={accountCreationState.name}
          autoFocus
          onChange={e => this.handleChangeName(e.target.value)}
          placeholder={t("newAccount:options.acc_name_placeholder")}
          InputProps={{ className: classes.input }}
          fullWidth
        />
        <TextField
          value={parentAccountName}
          autoFocus
          onChange={e => this.handleChangeParentAccountName(e.target.value)}
          placeholder={t("newAccount:options.acc_name_placeholder")}
          InputProps={{ className: classes.input }}
          fullWidth
        />
      </Fragment>
    );
  };

  render() {
    const { classes, t, accountCreationState } = this.props;
    return (
      <div>
        <label htmlFor="name" className={classes.title}>
          {t("newAccount:options.name")}
        </label>
        <div className={classes.relative}>
          {accountCreationState.currency && this.renderCurrency()}
          {accountCreationState.erc20token && this.renderERC20Token()}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(translate()(AccountCreationOptions));
