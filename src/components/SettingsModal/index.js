//@flow
import React, { Component } from "react";
import debounce from "lodash/debounce";
import { NavLink, Switch, Route, Redirect } from "react-router-dom";
import { Tabs, Tab, TabList } from "react-tabs";
import FiatUnits from "../../fiat-units";
import TextField from "../utils/TextField";
import connectData from "../../restlay/connectData";
import ModalLoading from "../ModalLoading";
import type { RestlayEnvironment } from "../../restlay/connectData";
import AccountsQuery from "../../api/queries/AccountsQuery";
import SettingsDataQuery from "../../api/queries/SettingsDataQuery";
import SaveAccountSettingsMutation from "../../api/mutations/SaveAccountSettingsMutation";
import { Select, Option } from "../Select";
import type {
  Account,
  SecurityScheme,
  AccountSettings
} from "../../data/types";
import type { Response as SettingsDataQueryResponse } from "../../api/queries/SettingsDataQuery";

const { REACT_APP_SECRET_CODE } = process.env;

class NavAccount extends Component<{
  account: Account
}> {
  render() {
    const { account } = this.props;
    return (
      <NavLink className="nav-account" to={account.id}>
        {account.name}
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
    return <p>...</p>;
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
  onAccountNameChange = (name: string) => {
    this.update({ name });
  };
  onUnitIndexChange = (unitIndex: number) => {
    this.update({
      settings: {
        ...this.state.settings,
        unitIndex
      }
    });
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
        <h3>General</h3>
        <SettingsField label="Account Name">
          <TextField
            name="last_name"
            className="profile-form-name"
            value={name}
            hasError={!name}
            onChange={this.onAccountNameChange}
          />
        </SettingsField>
        <SettingsField label="Units">
          <Tabs
            selectedIndex={settings.unitIndex}
            onSelect={this.onUnitIndexChange}
          >
            <TabList>
              {account.currency.units.map((unit, tabIndex) => (
                <Tab key={tabIndex}>{unit.name}</Tab>
              ))}
            </TabList>
          </Tabs>
        </SettingsField>
        <SettingsField label="Blockchain Explorer">
          <Select onChange={this.onBlockchainExplorerChange}>
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
        <h3>Countervalue</h3>
        <SettingsField label="Source">
          <Select onChange={this.onCountervalueSourceChange}>
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
          <SettingsField label="Source">
            <Select onChange={this.onFiatChange}>
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
      </div>
    );
  }
}

class SettingsModal extends Component<{
  settingsData: SettingsDataQueryResponse,
  accounts: Account[],
  restlay: RestlayEnvironment
}> {
  render() {
    const { settingsData, accounts, restlay } = this.props;
    return (
      <div className="settings modal">
        <aside>
          <h3>ACCOUNTS</h3>
          {accounts.map(account => (
            <NavAccount account={account} key={account.id} />
          ))}
          <footer>
            <code className="version">
              {REACT_APP_SECRET_CODE || "unversioned"}
            </code>
            <a className="support" href="mailto:support@ledger.fr">
              support
            </a>
          </footer>
        </aside>
        <div className="body">
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
      </div>
    );
  }
}

export default connectData(SettingsModal, {
  RenderLoading: ModalLoading,
  queries: {
    settingsData: SettingsDataQuery,
    accounts: AccountsQuery
  }
});
