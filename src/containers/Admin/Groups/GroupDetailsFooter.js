// @flow
import React, { PureComponent, Fragment } from "react";
import { Trans } from "react-i18next";
import { approveFlow } from "device/interactions/approveFlow";
import PendingRequestsQuery from "api/queries/PendingRequestsQuery";

import DialogButton from "components/buttons/DialogButton";
import AbortRequestButton from "components/AbortRequestButton";
import ApproveRequestButton from "components/ApproveRequestButton";

import type { RestlayEnvironment } from "restlay/connectData";
import type { Group, Member } from "data/types";
import { withMe } from "components/UserContextProvider";
import { hasUserApprovedRequest } from "utils/request";

type Props = {
  group: Group,
  selected: Member[],
  me: Member,
  close: void => void,
  restlay: RestlayEnvironment
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

  onSuccess = () => {
    const { restlay, close } = this.props;
    restlay.fetchQuery(new PendingRequestsQuery());
    close();
  };

  editGroup = () => {
    console.warn("TODO: edit group's members");
  };

  render() {
    const { group, selected, me } = this.props;

    const { status } = group;
    const hasUserApproved =
      group.last_request && hasUserApprovedRequest(group.last_request, me);

    return (
      <Fragment>
        {status.startsWith("PENDING_") &&
          !hasUserApproved && (
            <Fragment>
              <AbortRequestButton
                requestID={group.last_request && group.last_request.id}
                onSuccess={this.onSuccess}
              />
              <ApproveRequestButton
                interactions={approveFlow}
                onSuccess={this.onSuccess}
                onError={null}
                additionalFields={{
                  request_id: group.last_request && group.last_request.id
                }}
                disabled={false}
                buttonLabel={<Trans i18nKey="common:approve" />}
              />
            </Fragment>
          )}
        {status === "APPROVED" && (
          <DialogButton abort onTouchTap={this.deleteGroup}>
            <Trans i18nKey="common:remove" />
          </DialogButton>
        )}
        {hasArrayChanged(group.members, selected) && (
          <DialogButton highlight onTouchTap={this.editGroup}>
            <Trans i18nKey="common:edit" />
          </DialogButton>
        )}
      </Fragment>
    );
  }
}

export default withMe(GroupDetailsFooter);
