// @flow

import React, { PureComponent, Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";
import { formatCurrencyUnit } from "@ledgerhq/live-common/lib/helpers/currencies";
import { Trans } from "react-i18next";
import CounterValue from "components/CounterValue";
import DialogButton from "components/buttons/DialogButton";
import type { Account } from "data/types";
import colors from "shared/colors";

type Props = {
  account: Account,
  totalSpent: number,
  canNext: boolean,
  onChangeTab: (SyntheticInputEvent<*>) => void,
  classes: { [_: $Keys<typeof styles>]: string },
};

const styles = {
  totalSpent: {
    fontSize: 13,
  },
  fiat: {
    marginLeft: 5,
    color: colors.steel,
  },
  footerDetails: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
};

class DetailsFooter extends PureComponent<Props> {
  render() {
    const { account, totalSpent, canNext, onChangeTab, classes } = this.props;

    const erc20Account = account.account_type === "ERC20";
    return (
      <Fragment>
        {!erc20Account && (
          <div className={classes.totalSpent}>
            <span>
              <strong>
                <Trans i18nKey="send:details.totalSpent" />{" "}
              </strong>
              {account.settings.currency_unit.code}{" "}
              {formatCurrencyUnit(account.settings.currency_unit, totalSpent)}
            </span>
            <span className={classes.fiat}>
              (<CounterValue value={totalSpent} from={account.currency_id} />)
            </span>
          </div>
        )}
        <DialogButton
          highlight
          right
          disabled={!canNext}
          onTouchTap={onChangeTab}
        >
          <Trans i18nKey="common:continue" />
        </DialogButton>
      </Fragment>
    );
  }
}

export default withStyles(styles)(DetailsFooter);
