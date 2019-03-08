// @flow
import React, { PureComponent, Fragment } from "react";
import { Trans } from "react-i18next";
import { connect } from "react-redux";
import { NetworkError } from "network";
import { approveFlow } from "device/interactions/approveFlow";
import { NoChannelForDevice, GenericError } from "utils/errors";
import { addMessage, addError } from "redux/modules/alerts";
import connectData from "restlay/connectData";
import DialogButton from "components/buttons/DialogButton";
import ProfileQuery from "api/queries/ProfileQuery";
import type { Group, Member, GateError } from "data/types";
import AbortRequestButton from "components/AbortRequestButton";
import ApproveRequestButton from "components/ApproveRequestButton";

type Props = {
  group: Group,
  selected: Member[],
  close: void => void,
  addMessage: (string, string, ?string) => void,
  addError: Error => void,
  me: Member
};

const mapDispatchToProps = {
  addMessage,
  addError
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
    this.props.close();
  };

  onError = (e: Error | GateError) => {
    if (e instanceof NetworkError && e.json) {
      this.props.addMessage(`Error ${e.json.code}`, e.json.message, "error");
    } else if (e instanceof NoChannelForDevice) {
      this.props.addError(e);
    } else {
      this.props.addError(new GenericError());
    }
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
      <Fragment>
        {status === "PENDING_APPROVAL" &&
          !hasUserApproved && (
            <Fragment>
              <AbortRequestButton
                requestID={group.last_request_id}
                onSuccess={this.onSuccess}
                onError={this.onError}
              />
              <ApproveRequestButton
                interactions={approveFlow}
                onSuccess={this.onSuccess}
                onError={this.onError}
                additionalFields={{ request_id: group.last_request_id }}
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

export default connect(
  null,
  mapDispatchToProps
)(
  connectData(GroupDetailsFooter, {
    queries: {
      me: ProfileQuery
    }
  })
);
