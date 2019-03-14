// @flow

import React, { Component } from "react";
import { Trans, Interpolate } from "react-i18next";
import type { Connection } from "restlay/ConnectionQuery";

import TryAgain from "components/TryAgain";
import connectData from "restlay/connectData";
import UsersQuery from "api/queries/UsersQuery";
import ModalLoading from "components/ModalLoading";
import MemberRow from "components/MemberRow";
import DialogButton from "components/buttons/DialogButton";
import type { Member } from "data/types";

import colors from "shared/colors";

import Text from "components/base/Text";
import Box from "components/base/Box";
import {
  ModalBody,
  ModalHeader,
  ModalTitle,
  ModalFooter
} from "components/base/Modal";

const SelectedCounter = ({ count }: { count: number }) => (
  <Text bold small uppercase color={colors.lead}>
    <Interpolate
      i18nKey="newAccount:security.members_selected"
      options={{ count }}
      nbMembersSelected={count}
    />
  </Text>
);

class ListApprovers extends Component<{
  goBack: Function,
  users: Connection<Member>,
  approvers: Member[],
  addApprover: Function
}> {
  render() {
    const { goBack, users, addApprover, approvers } = this.props;
    // TODO need an endpoint not paginated for this
    const paginatedUsers = users.edges.map(e => e.node);

    return (
      <ModalBody height={615}>
        <ModalHeader>
          <Box horizontal align="center" justify="space-between">
            <ModalTitle>
              <Trans i18nKey="newAccount:security.members" />
            </ModalTitle>
            {approvers.length > 0 && (
              <SelectedCounter count={approvers.length} />
            )}
          </Box>
        </ModalHeader>

        <Box grow overflow="auto" mx={-5} px={5}>
          {paginatedUsers.map(user => {
            const isChecked = approvers.indexOf(user.pub_key) > -1;
            return (
              <MemberRow
                key={user.id}
                member={user}
                checked={isChecked}
                onSelect={addApprover}
              />
            );
          })}
        </Box>

        <ModalFooter>
          <DialogButton
            right
            highlight
            onTouchTap={goBack}
            disabled={approvers.length < 2}
          >
            <Trans i18nKey="common:done" />
          </DialogButton>
        </ModalFooter>
      </ModalBody>
    );
  }
}

const RenderError = ({ error, restlay }: *) => (
  <div style={{ width: 500, height: 615 }}>
    <TryAgain error={error} action={restlay.forceFetch} />
  </div>
);

export default connectData(ListApprovers, {
  RenderLoading: ModalLoading,
  RenderError,
  queries: {
    users: UsersQuery
  },
  initialVariables: {
    // TODO remove this when endpoint is not paginated anymore
    users: 30
  }
});
