// @flow

import React, { PureComponent } from "react";
import connectData from "restlay/connectData";
import { Trans } from "react-i18next";
import { FaMoneyCheck } from "react-icons/fa";
import type { Match } from "react-router-dom";
import type { MemoryHistory } from "history";

import AccountQuery from "api/queries/AccountQuery";
import Text from "components/base/Text";
import { CardError } from "components/base/Card";
import SpinnerCard from "components/spinners/SpinnerCard";
import { createAndApprove } from "device/interactions/approveFlow";
import Box from "components/base/Box";
import { TabName } from "containers/Admin/Groups/GroupDetails";
import colors from "shared/colors";
import AccountOverview from "containers/Admin/Accounts/AccountOverview";
import AccountOperationsRules from "containers/Admin/Accounts/AccountOperationsRules";
import AccountHistory from "containers/Admin/Accounts/AccountHistory";
import Button from "components/base/Button";
import RequestActionButtons from "components/RequestActionButtons";

import ApproveRequestButton from "components/ApproveRequestButton";
import EntityLastRequest from "components/EntityLastRequest";

import { ModalClose } from "components/base/Modal";
import { hasPendingRequest } from "utils/entities";
import { MdEdit } from "react-icons/md";

import type { Account } from "data/types";

type Props = {
  close: () => void,
  account: Account,
  match: Match,
  history: MemoryHistory,
};

type State = {
  tabsIndex: number,
};

// TODO: to be split and refactored after demo
class AccountDetails extends PureComponent<Props, State> {
  state = {
    tabsIndex: 0,
  };

  onTabChange = (tabsIndex: number) => {
    this.setState({ tabsIndex });
  };

  editAccount = () => {
    const { history, account, match } = this.props;
    if (match.params["0"]) {
      history.push(`${match.params["0"]}/accounts/edit/${account.id}`);
    }
  };

  EditTab: (Account, number) => React$Node = (account, tabsIndex) => {
    return (
      <Box horizontal align="center" flow={20}>
        {hasPendingRequest(account) ? (
          <TabName
            isActive={tabsIndex === 3}
            onClick={() => this.onTabChange(3)}
          >
            <Text uppercase small>
              LAST REQUEST
            </Text>
          </TabName>
        ) : (
          account.status === "ACTIVE" && (
            <Box>
              <Button
                size="tiny"
                onClick={this.editAccount}
                variant="filled"
                IconLeft={MdEdit}
                customColor={colors.ocean}
              >
                edit
              </Button>
            </Box>
          )
        )}
      </Box>
    );
  };

  render() {
    const { close, account } = this.props;
    const { status } = account;
    const { tabsIndex } = this.state;

    return (
      <Box width={700} style={{ minHeight: 600 }} position="relative">
        <ModalClose onClick={close} />
        <Box bg="#f5f5f5" p={40} pb={0} flow={20} style={styles.header}>
          <Box horizontal align="center" flow={10}>
            <FaMoneyCheck size={24} color="#ddd" />
            <Text large color="#aaa">
              {account.name}
            </Text>
          </Box>
          <Box horizontal flow={15} justify="space-between">
            <Box horizontal align="center">
              <TabName
                isActive={tabsIndex === 0}
                onClick={() => this.onTabChange(0)}
              >
                <Text uppercase small>
                  Overview
                </Text>
              </TabName>
              <TabName
                isActive={tabsIndex === 1}
                onClick={() => this.onTabChange(1)}
              >
                <Text uppercase small>
                  Operations Rules
                </Text>
              </TabName>
              <TabName
                isActive={tabsIndex === 2}
                onClick={() => this.onTabChange(2)}
              >
                <Text uppercase small>
                  History
                </Text>
              </TabName>
            </Box>
            {this.EditTab(account, tabsIndex)}
          </Box>
        </Box>
        <Box grow p={40} pb={100} style={styles.content}>
          {tabsIndex === 0 && <AccountOverview account={account} />}
          {tabsIndex === 1 && <AccountOperationsRules account={account} />}
          {tabsIndex === 2 && <AccountHistory account={account} />}
          {tabsIndex === 3 && <EntityLastRequest entity={account} />}
        </Box>
        <Box px={10} style={styles.footer}>
          {hasPendingRequest(account) && (
            <RequestActionButtons
              onSuccess={close}
              onError={null}
              entity={account}
            />
          )}
          {status === "ACTIVE" && tabsIndex < 2 && !hasPendingRequest(account) && (
            <Box style={{ width: 200 }}>
              <ApproveRequestButton
                interactions={createAndApprove}
                onSuccess={close}
                color={colors.grenade}
                onError={null}
                isRevoke
                disabled={false}
                additionalFields={{
                  data: { account_id: account.id },
                  type: "REVOKE_ACCOUNT",
                }}
                buttonLabel={<Trans i18nKey="account:delete" />}
              />
            </Box>
          )}
        </Box>
      </Box>
    );
  }
}

export default connectData(AccountDetails, {
  RenderError: CardError,
  RenderLoading: SpinnerCard,
  queries: {
    account: AccountQuery,
  },
  propsToQueryParams: props => ({
    accountId: props.match.params.accountId || "",
  }),
});

const styles = {
  header: {
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    userSelect: "none",
  },
  footer: {
    padding: 0,
  },
  content: {
    userSelect: "none",
  },
  checkOrNumber: {
    width: 10,
  },
};
