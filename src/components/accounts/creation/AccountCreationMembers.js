import _ from "lodash";
import React, { Component } from "react";
import connectData from "../../../restlay/connectData";
import MembersQuery from "../../../api/queries/MembersQuery";
import PropTypes from "prop-types";
import "./AccountCreationMembers.css";
import Checkbox from "../../form/Checkbox";
import ModalLoading from "../../../components/ModalLoading";
import MemberRow from "../../../components/MemberRow";
import InfoModal from "../../../components/InfoModal";
import { Avatar, DialogButton, Overscroll } from "../../../components";

class AccountCreationMembers extends Component {
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
            {_.map(members, member => {
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

AccountCreationMembers.propTypes = {
  organization: PropTypes.shape({}).isRequired,
  members: PropTypes.arrayOf(PropTypes.string).isRequired,
  approvers: PropTypes.arrayOf(PropTypes.string).isRequired,
  getOrganizationMembers: PropTypes.func.isRequired,
  switchInternalModal: PropTypes.func.isRequired,
  addMember: PropTypes.func.isRequired
};

export default connectData(AccountCreationMembers, {
  RenderLoading: ModalLoading,
  queries: {
    members: MembersQuery
  }
});
