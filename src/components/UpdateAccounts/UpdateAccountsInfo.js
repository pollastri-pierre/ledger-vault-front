//@flow
import React, { Component } from "react";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import { getOutdatedAccounts } from "utils/accounts";
import { withStyles } from "@material-ui/core/styles";
import type { Translate } from "data/types";
import DialogButton from "components/buttons/DialogButton";
import type { Account } from "data/types";
import { toggleModal } from "redux/modules/update-accounts";
import BlurDialog from "components/BlurDialog";
import colors from "shared/colors";
import WarningIcon from "components/icons/TriangleWarning";

const warning = {
  base: {
    "& a": {
      color: "white",
      textDecoration: "none",
      fontWeight: "bold"
    },
    background: colors.grenade,
    borderRadius: 5,
    color: "white",
    lineHeight: "40px",
    textAlign: "center"
  },
  icon: {
    marginRight: 10,
    verticalAlign: "middle"
  }
};
const Warning = withStyles(
  warning
)(
  ({
    classes,
    children
  }: {
    children: *,
    classes: { [$Keys<typeof warning>]: string }
  }) => (
    <div className={classes.base}>
      <WarningIcon width={20} height={20} className={classes.icon} />
      {children}
    </div>
  )
);
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
    const { t, classes } = this.props;
    return (
      <BlurDialog open={open} onClose={this.close}>
        <div className={classes.base}>
          <h2>{t("updateAccounts:title")}</h2>
          <p>
            {t("updateAccounts:accounts_updated")}{" "}
            <a
              href="https://help.vault.ledger.com/Content/whatsnew.htm"
              target="new"
            >
              release notes
            </a>
          </p>
          <p>{t("updateAccounts:unable_access")}</p>
          <Warning>
            <a
              href="https://help.vault.ledger.com/Content/operations/updateaccount.htm"
              target="new"
            >
              {t("updateAccounts:instruction")}
            </a>
          </Warning>
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
