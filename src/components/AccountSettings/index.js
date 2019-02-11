// @flow
import React, { PureComponent, Fragment } from "react";
import { Trans } from "react-i18next";
import debounce from "lodash/debounce";
import { withStyles } from "@material-ui/core/styles";
import { FaUsers, FaExchangeAlt } from "react-icons/fa";

import SelectTab from "components/SelectTab/SelectTab";
import connectData from "restlay/connectData";
import type { RestlayEnvironment } from "restlay/connectData";
import SaveAccountSettingsMutation from "api/mutations/SaveAccountSettingsMutation";
import HeaderRightClose from "components/HeaderRightClose";
import { connect } from "react-redux";
import Text from "components/base/Text";
import { currencyExchangeSelector } from "redux/modules/exchanges";
import LineSeparator from "components/LineSeparator";
import { getCryptoCurrencyById } from "utils/cryptoCurrencies";
import type { Account, Unit } from "data/types";
import { SectionTitle, SectionHeader, SectionRow } from "./SettingsSection";
import colors from "../../shared/colors";

const styles = {
  root: {
    width: 460,
    display: "flex",
    flexDirection: "column",
    height: 600
  },
  settingsModalContainer: {
    padding: 40
  },
  row: {
    display: "flex",
    flexDirection: "row"
  },
  icon: {
    marginRight: 5,
    display: "flex",
    alignSelf: "center"
  }
};
type Props = {
  account: Account,
  close: Function,
  classes: { [_: $Keys<typeof styles>]: string },
  restlay: RestlayEnvironment,
  exchange: string
};
type State = {
  settings: {
    currency_unit: $Shape<Unit>
  }
};

const mapStateToProps = (state: State, props: Props) => {
  const {
    account: { currency_id }
  } = props;
  const currency = getCryptoCurrencyById(currency_id);
  return {
    exchange: currencyExchangeSelector(state, currency)
  };
};

class AccountSettings extends PureComponent<Props, State> {
  constructor({ account }: $Shape<Props>) {
    super();
    const { settings } = account;
    this.state = {
      settings
    };
  }

  onUnitIndexChange = (unitIndex: number) => {
    const curr = getCryptoCurrencyById(this.props.account.currency_id);
    this.update({
      settings: {
        ...this.state.settings,
        currency_unit: curr.units[unitIndex]
      }
    });
  };

  debouncedCommit = debounce(() => {
    const {
      props: { restlay, account },
      state: { settings }
    } = this;
    const currencyCode = settings.currency_unit.code;
    const m = new SaveAccountSettingsMutation({
      account,
      currency_unit: currencyCode
    });
    restlay.commitMutation(m);
  }, 1000);

  update = (update: $Shape<State>) => {
    this.setState(update);
    this.debouncedCommit();
  };

  render() {
    const { account, close, classes, exchange } = this.props;
    const { settings } = this.state;
    const {
      security_scheme: { quorum },
      members
    } = this.props.account;
    const curr = getCryptoCurrencyById(account.currency_id);
    const units = curr.units;
    const unit_index = units.findIndex(
      unit =>
        unit.code.toLowerCase() === settings.currency_unit.code.toLowerCase()
    );
    return (
      <div className={classes.root}>
        <div className={classes.settingsModalContainer}>
          <SectionHeader header={<Trans i18nKey="accountSettings:header" />} />
          <HeaderRightClose close={close} />
          <div>
            <SectionTitle
              title={<Trans i18nKey="accountSettings:general.title" />}
            />
            <SectionRow
              label={<Trans i18nKey="accountSettings:general.name" />}
            >
              <Text bold>{account.name}</Text>
            </SectionRow>
            <SectionRow
              label={<Trans i18nKey="accountSettings:general.exchange" />}
            >
              <div className={classes.row}>
                <FaExchangeAlt
                  size={13}
                  className={classes.icon}
                  color={colors.lightGrey}
                />
                <Text bold>
                  {exchange || <Trans i18nKey="common:not_applicable" />}
                </Text>
              </div>
            </SectionRow>
            <SectionRow
              label={<Trans i18nKey="accountSettings:general.units" />}
            >
              <SelectTab
                tabs={units.map(elem => elem.code)}
                onChange={this.onUnitIndexChange}
                selected={unit_index}
                theme="inline"
              />
            </SectionRow>
            <LineSeparator />
          </div>
          <div>
            {account.status !== "VIEW_ONLY" && (
              <Fragment>
                <SectionTitle
                  title={
                    <Trans i18nKey="accountSettings:operationRules.title" />
                  }
                />
                <SectionRow
                  label={
                    <Trans i18nKey="accountSettings:operationRules.approvals" />
                  }
                >
                  <div className={classes.row}>
                    <FaUsers
                      size={13}
                      className={classes.icon}
                      color={colors.lightGrey}
                    />
                    <Text bold>
                      {quorum} out of {members.length}
                    </Text>
                  </div>
                </SectionRow>
              </Fragment>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default connectData(
  connect(
    mapStateToProps,
    null
  )(withStyles(styles)(AccountSettings))
);
