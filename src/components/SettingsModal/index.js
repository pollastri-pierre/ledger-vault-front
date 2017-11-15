//@flow
import React, { Component } from "react";
import { NavLink, Switch, Route, Redirect } from "react-router-dom";
import connectData from "../../restlay/connectData";
import type { RestlayEnvironment } from "../../restlay/connectData";
import AccountsQuery from "../../api/queries/AccountsQuery";
import SettingsQuery from "../../api/queries/SettingsQuery";
import type {
  Account,
  SecurityScheme,
  AccountSettings
} from "../../data/types";
import type { Response as SettingsQueryResponse } from "../../api/queries/SettingsQuery";

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

class SecuritySchemeSettingsEdit extends Component<{
  securityScheme: SecurityScheme,
  onChange: SecurityScheme => void
}> {
  render() {
    return <p>...</p>;
  }
}

type Props = {
  settings: SettingsQueryResponse,
  account: Account,
  restlay: RestlayEnvironment
};
type State = {
  name: string,
  security_scheme: SecurityScheme,
  settings: AccountSettings
};
class AccountSettingsEdit extends Component<Props, State> {
  constructor({ account }: Props) {
    super();
    const { security_scheme, name, settings } = account;
    this.state = {
      security_scheme,
      name,
      settings
    };
  }
  onSecuritySchemeChange = (security_scheme: SecurityScheme) => {
    this.setState({ security_scheme });
  };
  onAccountNameChange = (name: string) => {
    this.setState({ name });
  };
  onUnitIndexChange = (unitIndex: number) => {
    this.setState({
      settings: {
        ...this.state.settings,
        unitIndex
      }
    });
  };
  onBlockchainExplorerChange = (blockchainExplorer: string) => {
    this.setState({
      settings: {
        ...this.state.settings,
        blockchainExplorer
      }
    });
  };
  onCountervalueSourceChange = (countervalueSource: string) => {
    this.setState({
      settings: {
        ...this.state.settings,
        countervalueSource
      }
    });
  };
  onFiatChange = (fiat: string) => {
    this.setState({
      settings: {
        ...this.state.settings,
        fiat
      }
    });
  };
  render() {
    const { security_scheme } = this.state;
    return (
      <div className="account-settings">
        <h3>Security scheme</h3>
        <SecuritySchemeSettingsEdit
          onChange={this.onSecuritySchemeChange}
          securityScheme={security_scheme}
        />
        <h3>General</h3>
        <p>...</p>
        <h3>Countervalue</h3>
        <p>...</p>
      </div>
    );
  }
}

class SettingsModal extends Component<{
  settings: SettingsQueryResponse,
  accounts: Account[],
  restlay: RestlayEnvironment
}> {
  render() {
    const { settings, accounts, restlay } = this.props;
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
                      settings={settings}
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
  queries: {
    settings: SettingsQuery,
    accounts: AccountsQuery
  }
});
