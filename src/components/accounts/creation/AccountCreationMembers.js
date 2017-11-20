//@flow
import React, { Component } from "react";
import connectData from "../../../restlay/connectData";
import MembersQuery from "../../../api/queries/MembersQuery";
import "./AccountCreationMembers.css";
import ModalLoading from "../../../components/ModalLoading";
import MemberRow from "../../../components/MemberRow";
import InfoModal from "../../../components/InfoModal";
import { DialogButton, Overscroll } from "../../../components";
import type { Member } from "../../../data/types";

const SelectedCounter = ({ count }) => {
  if (count === 0) {
    return false;
  }
  if (count === 1) {
    return <span className="counter">{count} member selected</span>;
  }
  return <span className="counter">{count} members selected</span>;
};

class AccountCreationMembers extends Component<{
  switchInternalModal: Function,
  addMember: Function,
  members: Member[],
  approvers: string[]
}> {
  render() {
    const { switchInternalModal, addMember, members, approvers } = this.props;

    return (
      <div className="account-creation-members wrapper">
        <header>
          <h2>Members</h2>
          <SelectedCounter count={approvers.length} />
          <InfoModal>
            Members define the group of individuals that have the ability to
            approve outgoing operations from this account.
          </InfoModal>
        </header>
        <div className="content">
          <Overscroll>
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
          </Overscroll>
        </div>
        <div className="footer">
          <DialogButton
            right
            highlight
            onTouchTap={() => switchInternalModal("main")}
          >
            Done
          </DialogButton>
        </div>
      </div>
    );
  }
}

export default connectData(AccountCreationMembers, {
  RenderLoading: ModalLoading,
  queries: {
    members: MembersQuery
  }
});
