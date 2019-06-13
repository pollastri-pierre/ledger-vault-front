// @flow
import React, { PureComponent } from "react";
import { Trans } from "react-i18next";
import Box from "components/base/Box";
import InfoBox from "components/base/InfoBox";
import SelectGroupsUsers from "components/SelectGroupsUsers";
import { Label } from "components/base/form";

import type { User } from "data/types";
import type { GroupCreationStepProps } from "./types";

type Props = GroupCreationStepProps & {};

const MAX_MEMBERS = 20;

class GroupCreationMembers extends PureComponent<Props> {
  onChange = (data: { members: User[] }) => {
    const { updatePayload } = this.props;
    updatePayload({ members: data.members });
  };

  render() {
    const { payload, operators, isEditMode } = this.props;
    const listOperators = operators.edges.map(e => e.node);
    return (
      <Box justify="space-between" grow>
        <Box>
          <Label>Select group members:</Label>
          <SelectGroupsUsers
            autoFocus={!isEditMode}
            openMenuOnFocus
            members={listOperators}
            value={{ members: payload.members, group: [] }}
            onChange={this.onChange}
            hasReachMaxLength={payload.members.length === MAX_MEMBERS}
          />
        </Box>
        {payload.members.length === MAX_MEMBERS && (
          <InfoBox withIcon type="info">
            <Trans i18nKey="group:maxMembers" />
          </InfoBox>
        )}
      </Box>
    );
  }
}

export default GroupCreationMembers;
