// @flow
import React, { PureComponent } from "react";
import { Trans } from "react-i18next";
import connectData from "restlay/connectData";
import ProfileQuery from "api/queries/ProfileQuery";
import Button from "@material-ui/core/Button";
import type { Group, Member } from "data/types";
import Box from "components/base/Box";

type Props = {
  group: Group,
  selected: Member[],
  me: Member
};

// if the group is pending the user can approve/reject the request
// if the group is pending AND user approved it, he can do NOTHING
// if the  group is ACTIVE he can delete the group ( it goes though quorum validation )

const hasArrayChanged = (array1: Member[], array2: Member[]): boolean => {
  if (array1.length !== array2.length) {
    return true;
  }
  let i = 0;
  const find = array2.find(a2 => a2.id === array1[i].id);
  while (i < array1.length && find) {
    i++;
  }

  return i !== array1.length;
};

class GroupDetailsFooter extends PureComponent<Props> {
  deleteGroup = () => {
    console.warn("TODO: delete group");
  };

  rejectGroup = () => {
    console.warn("TODO: reject group pending");
  };

  approveGroup = () => {
    console.warn("TODO: approve group");
  };

  editGroup = () => {
    console.warn("TODO: edit group's members");
  };

  render() {
    const { me, group, selected } = this.props;

    const { status, approvals } = group;
    const hasUserApproved =
      approvals.filter(a => a.person.id === me.id).length > 0;

    return (
      <Box pb={10} justify="flex-end" horizontal>
        {status === "PENDING_APPROVAL" &&
          !hasUserApproved && (
            <Box horizontal>
              <Button color="secondary" onClick={this.rejectGroup}>
                <Trans i18nKey="common:reject" />
              </Button>
              <Button color="primary" onClick={this.approveGroup}>
                <Trans i18nKey="common:approve" />
              </Button>
            </Box>
          )}
        {status === "APPROVED" && (
          <Button color="secondary" onClick={this.rejectGroup}>
            <Trans i18nKey="common:remove" />
          </Button>
        )}
        {hasArrayChanged(group.members, selected) && (
          <Button color="primary" onClick={this.editGroup}>
            <Trans i18nKey="common:edit" />
          </Button>
        )}
      </Box>
    );
  }
}

export default connectData(GroupDetailsFooter, {
  queries: {
    me: ProfileQuery
  }
});
