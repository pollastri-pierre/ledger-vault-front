// @flow
import React, { PureComponent, Fragment } from "react";
import { Trans } from "react-i18next";
import { createAndApprove } from "device/interactions/approveFlow";

import RequestActionButtons from "components/RequestActionButtons";
import ApproveRequestButton from "components/ApproveRequestButton";

import type { Group, User } from "data/types";
import { withMe } from "components/UserContextProvider";
import { hasUserApprovedRequest } from "utils/request";

type Props = {
  group: Group,
  selected: User[],
  me: User,
  close: void => void,
};

// if the group is pending the user can approve/reject the request
// if the group is pending AND user approved it, he can do NOTHING
// if the  group is ACTIVE he can delete the group ( it goes though quorum validation )

const hasArrayChanged = (array1: User[], array2: User[]): boolean => {
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

  onSuccess = () => {
    const { close } = this.props;
    close();
  };

  render() {
    const { group, selected, me } = this.props;

    const { status } = group;
    const hasUserApproved =
      group.last_request &&
      group.last_request.approvals &&
      hasUserApprovedRequest(group.last_request, me);

    return (
      <Fragment>
        {status.startsWith("PENDING_") && !hasUserApproved && (
          <RequestActionButtons
            onSuccess={this.onSuccess}
            onError={null}
            entity={group}
          />
        )}
        {status === "ACTIVE" && (
          <ApproveRequestButton
            interactions={createAndApprove}
            onSuccess={this.onSuccess}
            onError={null}
            disabled={false}
            additionalFields={{
              data: { group_id: group.id },
              type: "REVOKE_GROUP",
            }}
            buttonLabel={<Trans i18nKey="group:delete" />}
          />
        )}
        {hasArrayChanged(group.members, selected) && (
          <ApproveRequestButton
            interactions={createAndApprove}
            onSuccess={this.onSuccess}
            disabled={false}
            onError={null}
            additionalFields={{
              data: { group_id: group.id },
              type: "EDIT_GROUP",
            }}
            buttonLabel={<Trans i18nKey="common:edit" />}
          />
        )}
      </Fragment>
    );
  }
}

export default withMe(GroupDetailsFooter);
