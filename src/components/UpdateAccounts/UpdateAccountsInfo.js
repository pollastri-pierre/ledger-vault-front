//@flow
import React, { Component } from "react";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import { getOutdatedAccounts } from "utils/accounts";
import uniq from "lodash/uniq";
import { withStyles } from "@material-ui/core/styles";
import type { Translate } from "data/types";
import DialogButton from "components/buttons/DialogButton";
import type { Account } from "data/types";
import { toggleModal } from "redux/modules/update-accounts";
import BlurDialog from "components/BlurDialog";

const styles = {
  base: {
    width: 500,
    padding: "40px 40px 0 40px",
    "& h2": {
      margin: 0
    },
    "& ul": {
      fontSize: 14
    },
    "& p": {
      fontSize: 14,
      lineHeight: "24px"
    }
  },
  footer: {
    marginTop: 40,
    display: "flex",
    justifyContent: "space-between"
  }
};
type Props = {
  accounts: Account[],
  onToggle: Function,
  classes: { [_: $Keys<typeof styles>]: string },
  t: Translate
};

type State = {
  open: boolean
};
class UpdateAccountsInfo extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    // we get the initialvalue from props.accounts. It's safe because
    // it is a seed value.
    this.state = { open: getOutdatedAccounts(props.accounts).length > 0 };
  }

  close = () => {
    this.setState({ open: false });
  };

  goToUpdate = () => {
    this.close();
    this.props.onToggle();
  };

  render() {
    const { open } = this.state;
    const { accounts, t, classes } = this.props;
    const currencies = uniq(
      getOutdatedAccounts(accounts).map(a => a.currency.name)
    );
    return (
      <BlurDialog open={open} onClose={this.close}>
        <div className={classes.base}>
          <h2>{t("updateAccounts:title")}</h2>
          <p>{t("updateAccounts:accounts_updated")}:</p>
          <ul>{currencies.map(c => <li key={c}>{c}</li>)}</ul>
          <p>{t("updateAccounts:unable_access")}</p>
          <p>{t("updateAccounts:when_ready")}</p>
          <div className={classes.footer}>
            <DialogButton onTouchTap={this.close}>Close</DialogButton>
            <DialogButton highlight onTouchTap={this.goToUpdate}>
              Get Started
            </DialogButton>
          </div>
        </div>
      </BlurDialog>
    );
  }
}

const mapDispatchToProps = (dispatch: *) => ({
  onToggle: () => dispatch(toggleModal())
});
export default connect(null, mapDispatchToProps)(
  withStyles(styles)(translate()(UpdateAccountsInfo))
);
