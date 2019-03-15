// @flow
import React, { Component } from "react";
import { connect } from "react-redux";
import { Trans } from "react-i18next";
import { getOutdatedAccounts } from "utils/accounts";
import { withStyles } from "@material-ui/core/styles";
import DialogButton from "components/buttons/DialogButton";
import type { Account } from "data/types";
import { toggleModal } from "redux/modules/update-accounts";
import BlurDialog from "components/BlurDialog";
import { ModalClose } from "components/base/Modal";
import colors from "shared/colors";
import WarningIcon from "components/icons/TriangleWarning";
import ExternalLink from "components/icons/ExternalLink";
import Circle from "components/Circle";
import { urls } from "utils/urls";

const styles = {
  base: {
    width: 500,
    padding: "40px 40px 0 40px",
    "& p": {
      lineHeight: "24px",
    },
  },
  titleContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  warningIcon: {
    alignSelf: "center",
  },
  title: {
    textTransform: "uppercase",
    fontSize: 14,
    fontWeight: "bold",
    alignSelf: "center",
  },
  description: {
    fontSize: 13,
    color: colors.steel,
  },
  infoLinkContainer: {
    display: "flex",
    flexDirection: "row",
  },
  externalLink: {
    alignSelf: "center",
    display: "flex",
    marginLeft: 5,
  },
  infoLinkText: {
    marginTop: 40,
    "& a": {
      color: "rgb(234, 46, 73, 0.7)",
      textDecoration: "none",
    },
  },
  release_notes_href: {
    color: colors.black,
    marginRight: 3,
    textDecoration: "none",
  },
  footer: {
    marginTop: 40,
    display: "flex",
    justifyContent: "flex-end",
  },
};
type Props = {
  accounts: Account[],
  onToggle: Function,
  classes: { [_: $Keys<typeof styles>]: string },
};

type State = {
  open: boolean,
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
    const { classes } = this.props;
    return (
      <BlurDialog open={open}>
        <div className={classes.base}>
          <ModalClose onClick={this.close} />
          <div className={classes.titleContainer}>
            <Circle bg={colors.translucentGrenade} size="28px">
              <div>
                <WarningIcon width={16} height={16} color={colors.grenade} />
              </div>
            </Circle>
            <span className={classes.title}>
              <Trans i18nKey="updateAccounts:title" />
            </span>
          </div>
          <p className={classes.description}>
            <Trans i18nKey="updateAccounts:accounts_updated">
              {
                "The Ledger Vault platform has been updated. Find out more in the"
              }
              <a
                href={urls.release_notes}
                target="new"
                className={classes.release_notes_href}
              >
                {"release notes"}
              </a>
            </Trans>
            <ExternalLink color={colors.black} size={12} />.
          </p>
          <p className={classes.description}>
            <Trans i18nKey="updateAccounts:unable_access" />
          </p>
          <span className={classes.infoLinkText}>
            <a href={urls.update_account_info} target="new">
              <div className={classes.infoLinkContainer}>
                <Trans i18nKey="updateAccounts:instruction" />
                <div className={classes.externalLink}>
                  <ExternalLink color="rgb(234, 46, 73, 0.7)" size={14} />
                </div>
              </div>
            </a>
          </span>
          <div className={classes.footer}>
            <DialogButton highlight onTouchTap={this.goToUpdate}>
              <Trans i18nKey="common:get_started" />
            </DialogButton>
          </div>
        </div>
      </BlurDialog>
    );
  }
}

const mapDispatchToProps = (dispatch: *) => ({
  onToggle: () => dispatch(toggleModal()),
});
export default connect(
  null,
  mapDispatchToProps,
)(withStyles(styles)(UpdateAccountsInfo));
