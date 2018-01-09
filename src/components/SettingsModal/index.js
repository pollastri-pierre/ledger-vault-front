//@flow
import React, { Component } from "react";
import cx from "classnames";
import debounce from "lodash/debounce";
import { Switch, Route, Redirect } from "react-router-dom";
import { NavLink } from "react-router-relative-link";
import Select from "material-ui/Select";
import { MenuItem } from "material-ui/Menu";
import { withStyles } from "material-ui/styles";

import SelectTab from "components/SelectTab/SelectTab";
import fiatUnits from "constants/fiatUnits";
import connectData from "restlay/connectData";
import type { RestlayEnvironment } from "restlay/connectData";
import AccountsQuery from "api/queries/AccountsQuery";
import SettingsDataQuery from "api/queries/SettingsDataQuery";
import SaveAccountSettingsMutation from "api/mutations/SaveAccountSettingsMutation";
import SpinnerCard from "components/spinners/SpinnerCard";
import DialogButton from "../buttons/DialogButton";

import BadgeSecurity from "../BadgeSecurity";
import RateLimiterValue from "../RateLimiterValue";
import TimeLockValue from "../TimeLockValue";
import SettingsTextField from "../SettingsTextField";
import colors from "../../shared/colors";

import {
  BigSecurityTimeLockIcon,
  BigSecurityMembersIcon,
  BigSecurityRateLimiterIcon,
  BigSecurityAutoExpireIcon
} from "../icons";

import type { Account, SecurityScheme, AccountSettings } from "data/types";

import type { Response as SettingsDataQueryResponse } from "api/queries/SettingsDataQuery";

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
    overflowY: "auto",
    "&> * + *": {
      marginTop: 40
    }
  },
  contentSections: {
    "&> * + *": {
      marginTop: 30
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
  support: {
    display: "block",
    fontWeight: 600,
    color: colors.steel,
    textTransform: "uppercase",
    textDecoration: "none"
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
    alignItems: "flex-start",
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
  securityScheme: SecurityScheme,
  classes: { [_: $Keys<typeof styles>]: string }
}> {
  render() {
    const {
      securityScheme: {
        quorum,
        approvers,
        time_lock,
        rate_limiter,
        auto_expire
      },
      classes
    } = this.props;
    return (
      <div className={classes.securitySchemeView}>
        <BadgeSecurity
          noWidth
          icon={<BigSecurityMembersIcon />}
          label="Members"
          value={`${approvers.length} of ${quorum}`}
        />
        <BadgeSecurity
          noWidth
          icon={<BigSecurityTimeLockIcon />}
          label="Time-lock"
          disabled={!time_lock}
          value={<TimeLockValue time_lock={time_lock} />}
        />
        <BadgeSecurity
          noWidth
          icon={<BigSecurityRateLimiterIcon />}
          label="Rate Limiter"
          disabled={!rate_limiter}
          value={
            rate_limiter && (
              <RateLimiterValue
                max_transaction={rate_limiter.max_transaction}
                time_slot={rate_limiter.time_slot}
              />
            )
          }
        />
        <BadgeSecurity
          noWidth
          icon={<BigSecurityAutoExpireIcon />}
          label="Auto-expire"
          disabled={!auto_expire}
          value={<TimeLockValue time_lock={auto_expire} />}
        />
      </div>
    );
  }
}

type Props = {
  settingsData: SettingsDataQueryResponse,
  account: Account,
  restlay: RestlayEnvironment,
  classes: { [_: $Keys<typeof styles>]: string }
};
type State = {
  name: string,
  settings: AccountSettings
};
class AccountSettingsEdit extends Component<Props, State> {
  constructor({ account }: Props) {
    super();
    const { name, settings } = account;
    this.state = {
      name,
      settings
    };
  }
  debouncedCommit = debounce(() => {
    const { props: { restlay, account }, state } = this;
    const m = new SaveAccountSettingsMutation({ ...state, account });
    restlay.commitMutation(m);
  }, 300);
  update = (update: $Shape<State>) => {
    this.setState(update);
    this.debouncedCommit();
  };
  onAccountNameChange = (e: SyntheticInputEvent<>) => {
    const name = e.target.value;
    this.update({ name });
  };
  onUnitIndexChange = (unitIndex: number) => {
    if (unitIndex !== this.state.settings.unitIndex) {
      this.update({
        settings: {
          ...this.state.settings,
          unitIndex
        }
      });
    }
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
  onCountervalueSourceChange = ({
    target: { value: countervalueSource }
  }: *) => {
    this.update({
      settings: {
        ...this.state.settings,
        countervalueSource
      }
    });
  };
  onFiatChange = ({ target: { value: fiat } }: *) => {
    this.update({
      settings: {
        ...this.state.settings,
        fiat
      }
    });
  };
  render() {
    const { account, settingsData, classes } = this.props;
    const { name, settings } = this.state;
    const countervalueSourceData = settingsData.countervalueSources.find(
      c => c.id === settings.countervalueSource
    );
    return (
      <div className={classes.contentSections}>
        <div className={classes.capsTitle}>{"Security scheme"}</div>
        <SecuritySchemeView
          securityScheme={account.security_scheme}
          classes={classes}
        />

        <div className={classes.capsTitle}>{"General"}</div>
        <div className={classes.settingsFields}>
          <SettingsField botPadded label="Account Name" classes={classes}>
            <SettingsTextField
              name="last_name"
              value={name}
              hasError={!name}
              onChange={this.onAccountNameChange}
            />
          </SettingsField>

          <SettingsField topPadded label="Units" classes={classes}>
            <SelectTab
              tabs={account.currency.units.map(elem => elem.name)}
              onChange={this.onUnitIndexChange}
              selected={settings.unitIndex}
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
              value={settings.blockchainExplorer}
              onChange={this.onBlockchainExplorerChange}
              fullWidth
              disableUnderline
            >
              {settingsData.blockchainExplorers.map(({ id }) => (
                <MenuItem disableRipple key={id} value={id}>
                  {id}
                </MenuItem>
              ))}
            </Select>
          </SettingsField>
        </div>

        <div className={classes.capsTitle}>{"Countervalue"}</div>
        <div className={classes.settingsFields}>
          <SettingsField botPadded label="Source" classes={classes}>
            <Select
              value={settings.countervalueSource}
              onChange={this.onCountervalueSourceChange}
              fullWidth
              disableUnderline
            >
              {settingsData.countervalueSources.map(({ id }) => (
                <MenuItem disableRipple key={id} value={id}>
                  {id}
                </MenuItem>
              ))}
            </Select>
          </SettingsField>
          {countervalueSourceData ? (
            <SettingsField topPadded label="Fiat Currency" classes={classes}>
              <Select
                value={settings.fiat}
                onChange={this.onFiatChange}
                fullWidth
                disableUnderline
              >
                {countervalueSourceData.fiats.map(fiat => (
                  <MenuItem disableRipple key={fiat} value={fiat}>
                    {fiat} - {fiatUnits[fiat].name}
                  </MenuItem>
                ))}
              </Select>
            </SettingsField>
          ) : null}
        </div>
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
          {accounts.map(account => (
            <NavLink
              key={account.id}
              style={{ color: account.currency.color }}
              className={classes.sideItem}
              to={account.id}
            >
              <div className={classes.sideItemAccountName}>{account.name}</div>
              <div className={classes.sideItemCurrencyName}>
                {account.currency.name}
              </div>
            </NavLink>
          ))}
        </div>
      </div>
      <div className={classes.sideFooter}>
        <a className={classes.support} href="mailto:support@ledger.fr">
          support
        </a>
      </div>
    </div>
  );
}

class SettingsModal extends Component<{
  settingsData: SettingsDataQueryResponse,
  accounts: Account[],
  restlay: RestlayEnvironment,
  close: Function,
  classes: { [_: $Keys<typeof styles>]: string }
}> {
  render() {
    const { settingsData, accounts, restlay, close, classes } = this.props;
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
                      a => a.id === props.match.params.id
                    );
                    return account ? (
                      <AccountSettingsEdit
                        {...props}
                        classes={classes}
                        settingsData={settingsData}
                        key={account.id}
                        account={account}
                        restlay={restlay}
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
  connectData(SettingsModal, {
    RenderLoading,
    queries: {
      settingsData: SettingsDataQuery,
      accounts: AccountsQuery
    }
  })
);
