// @flow

import React, { PureComponent, Fragment } from "react";
import connectData from "restlay/connectData";
import { Trans } from "react-i18next";
import AccountQuery from "api/queries/AccountQuery";

import SpinnerCard from "components/spinners/SpinnerCard";
import Text from "components/base/Text";
import LineRow from "components/LineRow";
import EntityStatus from "components/EntityStatus";
import AccountName from "components/AccountName";
import DateFormat from "components/DateFormat";
import { createAndApprove, approveFlow } from "device/interactions/approveFlow";
import EntityModalTitle from "components/EntityModalTitle";

import AbortRequestButton from "components/AbortRequestButton";
import ApproveRequestButton from "components/ApproveRequestButton";

import { ModalHeader, ModalBody, ModalFooter } from "components/base/Modal";
import { withMe } from "components/UserContextProvider";

import { hasUserApprovedRequest } from "utils/request";

import type { Account, User } from "data/types";

type Props = {
  close: () => void,
  account: Account,
  me: User,
};

// TODO: to be split and refactored after demo
class AccountDetails extends PureComponent<Props> {
  render() {
    const { close, account, me } = this.props;
    const hasUserApproved =
      account.last_request &&
      account.last_request.approvals &&
      hasUserApprovedRequest(account.last_request, me);
    const { status } = account;

    return (
      <ModalBody height={500} onClose={close}>
        <ModalHeader title={account.name}>
          <EntityModalTitle entity={account} title={account.name} />
        </ModalHeader>
        <LineRow label={<Trans i18nKey="accountDetails:type" />}>
          {account.last_request && account.last_request.type}
        </LineRow>
        <LineRow label={<Trans i18nKey="accountDetails:name" />}>
          <AccountName account={account} />
        </LineRow>
        <LineRow label={<Trans i18nKey="accountDetails:created" />}>
          <DateFormat>
            {account.last_request && account.last_request.created_on}
          </DateFormat>
        </LineRow>
        <LineRow label={<Trans i18nKey="accountDetails:status" />}>
          <EntityStatus
            status={account.last_request && account.last_request.status}
          />
        </LineRow>
        <ModalFooter justify="space-between">
          {status.startsWith("PENDING") && !hasUserApproved && (
            <Fragment>
              <AbortRequestButton
                requestID={account.last_request && account.last_request.id}
                onSuccess={close}
              />
              <ApproveRequestButton
                interactions={approveFlow}
                onSuccess={close}
                onError={null}
                additionalFields={{
                  request_id: account.last_request && account.last_request.id,
                }}
                disabled={false}
                buttonLabel={
                  <Trans
                    i18nKey={
                      account.last_request
                        ? `request:approve.${account.last_request.type}`
                        : `common:approve`
                    }
                  />
                }
              />
            </Fragment>
          )}
          {status === "ACTIVE" && (
            <ApproveRequestButton
              interactions={createAndApprove}
              onSuccess={close}
              onError={null}
              disabled={false}
              additionalFields={{
                data: { account_id: account.id },
                type: "ARCHIVE_ACOUNT",
              }}
              buttonLabel={<Trans i18nKey="accountDetails:archive" />}
            />
          )}
        </ModalFooter>
      </ModalBody>
    );
  }
}

const RenderLoading = () => <SpinnerCard />;
const RenderError = () => <Text>Render error todo</Text>;

export default connectData(withMe(AccountDetails), {
  RenderError,
  RenderLoading,
  queries: {
    account: AccountQuery,
  },
  propsToQueryParams: props => ({
    accountId: props.match.params.accountId || "",
  }),
});
