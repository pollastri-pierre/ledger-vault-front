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
          {approvers.length > 0 ? (
            <span className="counter">{approvers.length} members selected</span>
          ) : (
            false
          )}
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
