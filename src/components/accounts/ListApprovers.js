// @flow

import React, { Component } from "react";
import { Trans, Interpolate } from "react-i18next";

import TryAgain from "components/TryAgain";
import connectData from "restlay/connectData";
import MembersQuery from "api/queries/MembersQuery";
import ModalLoading from "components/ModalLoading";
import MemberRow from "components/MemberRow";
import { DialogButton } from "components";
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
  members: Member[],
  approvers: Member[],
  addMember: Function
}> {
  render() {
    const { goBack, members, addMember, approvers } = this.props;

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
          {members.map(member => {
            const isChecked = approvers.indexOf(member.pub_key) > -1;
            return (
              <MemberRow
                key={member.id}
                member={member}
                checked={isChecked}
                onSelect={addMember}
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
    members: MembersQuery
  }
});
