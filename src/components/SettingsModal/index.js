//@flow
import React, { Component } from "react";
import { translate } from "react-i18next";
import CurrencyIndex from "components/CurrencyIndex";
import { getAccountTitle } from "utils/accounts";
import cx from "classnames";
import debounce from "lodash/debounce";
import { Switch, Route, Redirect } from "react-router-dom";
import { NavLink } from "react-router-relative-link";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { withStyles } from "@material-ui/core/styles";

import SelectTab from "components/SelectTab/SelectTab";
import connectData from "restlay/connectData";
import type { RestlayEnvironment } from "restlay/connectData";
import AccountsQuery from "api/queries/AccountsQuery";
import FiatCurrenciesQuery from "api/queries/FiatCurrenciesQuery";
import SaveAccountSettingsMutation from "api/mutations/SaveAccountSettingsMutation";
import EditAccountNameMutation from "api/mutations/EditAccountNameMutation";
import SpinnerCard from "components/spinners/SpinnerCard";
import DialogButton from "../buttons/DialogButton";
import BadgeSecurity from "../BadgeSecurity";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/helpers/currencies";
// import RateLimiterValue from "../RateLimiterValue";
// import TimeLockValue from "../TimeLockValue";
import colors from "../../shared/colors";

import {
  // BigSecurityTimeLockIcon,
  BigSecurityMembersIcon
  // BigSecurityRateLimiterIcon,
  // BigSecurityAutoExpireIcon
} from "../icons";

import type { Account, AccountSettings, Translate } from "data/types";

const styles = {
  container: {
    display: "flex",
    width: 690,
    height: 600
  },
  side: {
    width: 250,
    flexShrink: 0,
    backgroundColor: colors.cream,
    display: "flex",
    flexDirection: "column"
  },
  sideGrow: {
    padding: 40,
    paddingBottom: 0,
    overflowY: "auto",
    flexGrow: 1
  },
  bigTitle: {
    fontSize: 18,
    lineHeight: "12px"
  },
  capsTitle: {
    fontSize: 12,
    lineHeight: "12px",
    fontWeight: 600,
    textTransform: "uppercase"
  },
  contentWrapper: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column"
  },
  content: {
    flexGrow: 1,
    padding: 40,
    paddingBottom: 0,
    overflowY: "auto",
    "&> * + *": {
      marginTop: 40
    }
  },
  contentSections: {
    "&> * + *": {
      marginTop: 20
    }
  },
  footer: {
    flexShrink: 0,
    padding: "40px 40px 0 0"
  },
  sideItems: {
    padding: "5px 0",
    "&> * + *": {
      borderTop: `1px solid ${colors.argile}`
    }
  },
  sideItem: {
    position: "relative",
    padding: "20px 0",
    display: "block",
    textDecoration: "none",
    opacity: 0.5,
    "&> * + *": {
      marginTop: 10
    },
    "&.active": {
      opacity: 1,
      "&:before": {
        width: 5
      }
    },
    "&:hover": {
      "&:before": {
        width: 5
      }
    },
    "&:before": {
      content: '""',
      height: 22,
      position: "absolute",
      left: -40,
      backgroundColor: "currentColor",
      top: 30,
      width: 0,
      transition: "width 0.5s ease"
    }
  },
  sideItemAccountName: {
    // forced to put !important here because
    // else text take color of the link
    color: `${colors.black} !important`,
    fontSize: 13
  },
  sideItemCurrencyName: {
    // forced to put !important here because
    // else text take color of the link
    color: `${colors.steel} !important`,
    textTransform: "uppercase",
    fontWeight: 600,
    fontSize: 10
  },
  sideFooter: {
    padding: 40,
    color: colors.steel,
    fontSize: 11,
    "&> * + *": {
      marginTop: 10
    }
  },
  securitySchemeView: {
    display: "flex",
    alignItems: "flex-start",
    "& svg": {
      height: 30
    },
    "&> *": {
      flex: 1
    }
  },
  settingsFields: {
    "&> * + *": {
      borderTop: `1px solid ${colors.mouse}`
    }
  },
  settingsField: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between"
  },
  settingsFieldTopPadded: {
    paddingTop: 20
  },
  settingsFieldBotPadded: {
    paddingBottom: 10
  },
  settingsFieldLabel: {
    fontSize: 13
  }
};

class SettingsField extends Component<{
  label: string,
  children: React$Node,
  botPadded?: boolean,
  topPadded?: boolean,
  classes: { [_: $Keys<typeof styles>]: string }
}> {
  render() {
    const { children, label, botPadded, topPadded, classes } = this.props;
    return (
      <div
        className={cx(classes.settingsField, {
          [classes.settingsFieldBotPadded]: botPadded,
          [classes.settingsFieldTopPadded]: topPadded
        })}
      >
        <div className={classes.settingsFieldLabel}>{label}</div>
        <div>{children}</div>
      </div>
    );
  }
}

class SecuritySchemeView extends Component<{
  account: Account,
  t: Translate,
  classes: { [_: $Keys<typeof styles>]: string }
}> {
  render() {
    const {
      security_scheme: { quorum /* time_lock, rate_limiter, auto_expire */ },
      members
    } = this.props.account;
    const { classes, t } = this.props;
    return (
      <div className={classes.securitySchemeView}>
        <BadgeSecurity
          noWidth
          icon={<BigSecurityMembersIcon />}
          label={t("settings:security_scheme.quorum")}
          value={`${quorum} of ${members.length}`}
        />
        {/* <BadgeSecurity */}
        {/*   noWidth */}
        {/*   icon={<BigSecurityTimeLockIcon />} */}
        {/*   label="Time-lock" */}
        {/*   disabled={!time_lock} */}
        {/*   value={<TimeLockValue time_lock={time_lock} />} */}
        {/* /> */}
        {/* <BadgeSecurity */}
        {/*   noWidth */}
        {/*   icon={<BigSecurityRateLimiterIcon />} */}
        {/*   label="Rate Limiter" */}
        {/*   disabled={!rate_limiter} */}
        {/*   value={ */}
        {/*     rate_limiter && ( */}
        {/*       <RateLimiterValue */}
        {/*         max_transaction={rate_limiter.max_transaction} */}
        {/*         time_slot={rate_limiter.time_slot} */}
        {/*       /> */}
        {/*     ) */}
        {/*   } */}
        {/* /> */}
        {/* <BadgeSecurity */}
        {/*   noWidth */}
        {/*   icon={<BigSecurityAutoExpireIcon />} */}
        {/*   label="Auto-expire" */}
        {/*   disabled={!auto_expire} */}
        {/*   value={<TimeLockValue time_lock={auto_expire} />} */}
        {/* /> */}
      </div>
    );
  }
}

type Props = {
  settingsData: AccountSettings,
  t: Translate,
  account: *,
  restlay: RestlayEnvironment,
  classes: { [_: $Keys<typeof styles>]: string },
  fiats: *
};
type State = {
  name: string,
  settings: *
};
class AccountSettingsEdit extends Component<Props, State> {
  constructor({ account }: *) {
    super();
    const { name, settings } = account;
    this.state = {
      name,
      settings
    };
  }
  debouncedCommit = debounce(() => {
    const {
      props: { restlay, account },
      state: { settings }
    } = this;
    const currencyCode = settings.currency_unit["name"];
    const m = new SaveAccountSettingsMutation({
      account,
      currency_unit: currencyCode
      // fiat: settings.fiat.id || settings.fiat
    });
    restlay.commitMutation(m);
  }, 1000);

  debouncedCommitName = debounce(() => {
    const {
      props: { restlay, account },
      state: { name }
    } = this;
    const m = new EditAccountNameMutation({ name, account });
    restlay.commitMutation(m);
  }, 2000);
  update = (update: $Shape<State>) => {
    this.setState(update);
    this.debouncedCommit();
  };
  updateName = (name: string) => {
    this.setState({ name: name });
    this.debouncedCommitName();
  };
  onAccountNameChange = (e: SyntheticInputEvent<>) => {
    const name = e.target.value;
    this.updateName(name);
  };
  onUnitIndexChange = (unitIndex: number) => {
    const curr = getCryptoCurrencyById(this.props.account.currency_id);
    this.update({
      settings: {
        ...this.state.settings,
        currency_unit: curr.units[unitIndex]
      }
    });
  };
  onBlockchainExplorerChange = ({
    target: { value: blockchainExplorer }
  }: *) => {
    this.update({
      settings: {
        ...this.state.settings,
        blockchainExplorer
      }
    });
  };
  onFiatCurrencyChange = ({ target: { value: fiat } }: *) => {
    this.update({
      settings: {
        ...this.state.settings,
        fiat
      }
    });
  };
  render() {
    const { account, classes, t /* fiats  */ } = this.props;
    const { name, settings } = this.state;

    const curr = getCryptoCurrencyById(account.currency_id);
    const units = curr.units;
    const unit_index = units.findIndex(
      unit =>
        unit.code.toLowerCase() === settings.currency_unit.code.toLowerCase()
    );

    // const fiat = settings.fiat.id || settings.fiat;

    return (
      <div className={classes.contentSections}>
        <div className={classes.capsTitle}>{"Operation rules"}</div>
        <SecuritySchemeView t={t} account={account} classes={classes} />

        <div className={classes.capsTitle}>{"General"}</div>
        <div className={classes.settingsFields}>
          <SettingsField botPadded label="Account Name" classes={classes}>
            <span className={classes.settingsFieldLabel}>{name}</span>
          </SettingsField>

          <SettingsField topPadded label="Units" classes={classes}>
            <SelectTab
              tabs={units.map(elem => elem.name)}
              onChange={this.onUnitIndexChange}
              selected={unit_index}
              theme="inline"
            />
          </SettingsField>
          <SettingsField
            botPadded
            topPadded
            label="Blockchain Explorer"
            classes={classes}
          >
            <Select
              value={settings.blockchain_explorer}
              onChange={this.onBlockchainExplorerChange}
              fullWidth
              disableUnderline
            >
              {[{ id: "blockchain.info" }].map(({ id }) => (
                <MenuItem disableRipple key={id} value={id}>
                  {id}
                </MenuItem>
              ))}
            </Select>
          </SettingsField>
        </div>
        {/* <div className={classes.capsTitle}>{"Countervalue"}</div> */}
        {/* <SettingsField label="Fiat currency" classes={classes}> */}
        {/*   <Select */}
        {/*     value={fiat} */}
        {/*     onChange={this.onFiatCurrencyChange} */}
        {/*     fullWidth */}
        {/*     disableUnderline */}
        {/*   > */}
        {/*     {fiats.map(({ id, name }) => ( */}
        {/*       <MenuItem disableRipple key={id} value={id}> */}
        {/*         {name} */}
        {/*       </MenuItem> */}
        {/*     ))} */}
        {/*   </Select> */}
        {/* </SettingsField> */}
      </div>
    );
  }
}

function Side({
  classes,
  accounts
}: {
  accounts: Account[],
  classes: { [_: $Keys<typeof styles>]: string }
}) {
  return (
    <div className={classes.side}>
      <div className={classes.sideGrow}>
        <div className={classes.capsTitle}>{"Accounts"}</div>
        <div className={classes.sideItems}>
          {accounts.map(account => {
            const curr = getCryptoCurrencyById(account.currency_id);
            return (
              <NavLink
                key={account.id}
                style={{ color: curr.color }}
                className={classes.sideItem}
                to={String(account.id)}
              >
                <div className={classes.sideItemAccountName}>
                  {getAccountTitle(account)}
                </div>
                <div className={classes.sideItemCurrencyName}>
                  <CurrencyIndex
                    currency={account.currency_id}
                    index={account.index}
                  />
                </div>
              </NavLink>
            );
          })}
        </div>
      </div>
      <div className={classes.sideFooter} />
    </div>
  );
}

class SettingsModal extends Component<{
  accounts: *,
  t: Translate,
  fiats: *,
  restlay: RestlayEnvironment,
  close: Function,
  classes: { [_: $Keys<typeof styles>]: string }
}> {
  render() {
    const { accounts, restlay, close, classes, t, fiats } = this.props;
    return (
      <div className={classes.container}>
        <Side classes={classes} accounts={accounts} />
        <div className={classes.contentWrapper}>
          <div className={classes.content}>
            <div className={classes.bigTitle}>{"Settings"}</div>
            {accounts.length > 0 ? (
              <Switch>
                <Route
                  path="*/settings/:id"
                  render={props => {
                    const account = accounts.find(
                      a => a.id === parseInt(props.match.params.id, 10)
                    );
                    return account ? (
                      <AccountSettingsEdit
                        classes={classes}
                        t={t}
                        settingsData={account.settings}
                        key={account.id}
                        account={account}
                        restlay={restlay}
                        fiats={fiats}
                      />
                    ) : null;
                  }}
                />
                <Route
                  render={() => <Redirect to={"settings/" + accounts[0].id} />}
                />
              </Switch>
            ) : null}
          </div>
          <div className={classes.footer}>
            <DialogButton highlight right onTouchTap={() => close(true)}>
              Done
            </DialogButton>
          </div>
        </div>
      </div>
    );
  }
}

const RenderLoading = ({
  classes
}: {
  classes: { [_: $Keys<typeof styles>]: string }
}) => (
  <div className={classes.container}>
    <SpinnerCard />
  </div>
);

export default withStyles(styles)(
  connectData(translate()(SettingsModal), {
    RenderLoading,
    queries: {
      fiats: FiatCurrenciesQuery,
      accounts: AccountsQuery
    }
  })
);
