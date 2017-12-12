//@flow
import React, { Component } from "react";
import debounce from "lodash/debounce";
import { Switch, Route, Redirect } from "react-router-dom";
import { NavLink } from "react-router-relative-link";
import SelectTab from "../../components/SelectTab/SelectTab";
import FiatUnits from "../../fiat-units";
import TextField from "material-ui/TextField";
import connectData from "../../restlay/connectData";
import type { RestlayEnvironment } from "../../restlay/connectData";
import AccountsQuery from "../../api/queries/AccountsQuery";
import SettingsDataQuery from "../../api/queries/SettingsDataQuery";
import SaveAccountSettingsMutation from "../../api/mutations/SaveAccountSettingsMutation";
import SpinnerCard from "../../components/spinners/SpinnerCard";
import { Select, Option } from "../Select";
import DialogButton from "../buttons/DialogButton";
import {
  BigSecurityTimeLockIcon,
  BigSecurityMembersIcon,
  BigSecurityRateLimiterIcon,
  BigSecurityAutoExpireIcon
} from "../icons";
import BadgeSecurity from "../BadgeSecurity";
import RateLimiterValue from "../RateLimiterValue";
import TimeLockValue from "../TimeLockValue";
import SettingsTextField from "../SettingsTextField";
import type {
  Account,
  SecurityScheme,
  AccountSettings
} from "../../data/types";
import type { Response as SettingsDataQueryResponse } from "../../api/queries/SettingsDataQuery";
import "./index.css";

const { REACT_APP_SECRET_CODE } = process.env;

class NavAccount extends Component<{
  account: Account
}> {
  render() {
    const { account } = this.props;
    return (
      <NavLink
        className="nav-account"
        style={{ color: account.currency.color }}
        to={account.id}
      >
        <span className="name">{account.name}</span>
        <span className="currency">{account.currency.name}</span>
      </NavLink>
    );
  }
}

class SettingsField extends Component<{
  label: string,
  children: React$Node
}> {
  render() {
    const { children, label } = this.props;
    return (
      <label className="settings-field">
        <span className="label">{label}</span>
        <span className="body">{children}</span>
      </label>
    );
  }
}

class SecuritySchemeView extends Component<{
  securityScheme: SecurityScheme
}> {
  render() {
    const {
      securityScheme: {
        quorum,
        approvers,
        time_lock,
        rate_limiter,
        auto_expire
      }
    } = this.props;
    return (
      <div className="security-scheme">
        <BadgeSecurity
          icon={<BigSecurityMembersIcon />}
          label="Members"
          value={`${approvers.length} of ${quorum}`}
        />
        <BadgeSecurity
          icon={<BigSecurityTimeLockIcon />}
          label="Time-lock"
          disabled={!time_lock}
          value={<TimeLockValue time_lock={time_lock} />}
        />
        <BadgeSecurity
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
  restlay: RestlayEnvironment
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
  onBlockchainExplorerChange = (blockchainExplorer: string) => {
    this.update({
      settings: {
        ...this.state.settings,
        blockchainExplorer
      }
    });
  };
  onCountervalueSourceChange = (countervalueSource: string) => {
    this.update({
      settings: {
        ...this.state.settings,
        countervalueSource
      }
    });
  };
  onFiatChange = (fiat: string) => {
    this.update({
      settings: {
        ...this.state.settings,
        fiat
      }
    });
  };
  render() {
    const { account, settingsData } = this.props;
    const { name, settings } = this.state;
    const countervalueSourceData = settingsData.countervalueSources.find(
      c => c.id === settings.countervalueSource
    );
    return (
      <div className="account-settings">
        <h3>Security scheme</h3>
        <SecuritySchemeView securityScheme={account.security_scheme} />
        <section>
          <h3>General</h3>
          <SettingsField label="Account Name">
            <SettingsTextField
              name="last_name"
              value={name}
              hasError={!name}
              onChange={this.onAccountNameChange}
            />
          </SettingsField>
          <SettingsField label="Units">
            <SelectTab
              tabs={account.currency.units.map(elem => elem.name)}
              onChange={this.onUnitIndexChange}
              selected={settings.unitIndex}
              theme="inline"
            />
          </SettingsField>
          <SettingsField label="Blockchain Explorer">
            <Select onChange={this.onBlockchainExplorerChange} theme="black">
              {settingsData.blockchainExplorers.map(({ id }) => (
                <Option
                  key={id}
                  selected={settings.blockchainExplorer === id}
                  value={id}
                >
                  {id}
                </Option>
              ))}
            </Select>
          </SettingsField>
        </section>
        <section>
          <h3>Countervalue</h3>
          <SettingsField label="Source">
            <Select onChange={this.onCountervalueSourceChange} theme="black">
              {settingsData.countervalueSources.map(({ id }) => (
                <Option
                  key={id}
                  selected={settings.countervalueSource === id}
                  value={id}
                >
                  {id}
                </Option>
              ))}
            </Select>
          </SettingsField>
          {countervalueSourceData ? (
            <SettingsField label="Fiat Currency">
              <Select onChange={this.onFiatChange} theme="black">
                {countervalueSourceData.fiats.map(fiat => (
                  <Option
                    key={fiat}
                    selected={settings.fiat === fiat}
                    value={fiat}
                  >
                    {fiat} - {FiatUnits[fiat].name}
                  </Option>
                ))}
              </Select>
            </SettingsField>
          ) : null}
        </section>
      </div>
    );
  }
}

class SettingsModal extends Component<{
  settingsData: SettingsDataQueryResponse,
  accounts: Account[],
  restlay: RestlayEnvironment,
  close: Function
}> {
  render() {
    const { settingsData, accounts, restlay, close } = this.props;
    return (
      <div className="settings modal">
        <aside>
          <div className="asideScrollWrap">
            <h3>ACCOUNTS</h3>
            <div className="accounts">
              {accounts.map(account => (
                <div>
                  <NavAccount account={account} key={account.id} />
                  <NavAccount account={account} key={account.id} />
                </div>
              ))}
            </div>
            <div className="footernotes">
              <span className="version">
                {REACT_APP_SECRET_CODE || "unversioned"}
              </span>
              <a className="support" href="mailto:support@ledger.fr">
                support
              </a>
            </div>
          </div>
        </aside>
        <div className="body">
          <h2>Settings</h2>
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
          <footer>
            <DialogButton highlight right onTouchTap={() => close(true)}>
              Done
            </DialogButton>
          </footer>
        </div>
      </div>
    );
  }
}

const RenderLoading = () => (
  <div className="modal settings">
    <SpinnerCard />
  </div>
);

export default connectData(SettingsModal, {
  RenderLoading,
  queries: {
    settingsData: SettingsDataQuery,
    accounts: AccountsQuery
  }
});
