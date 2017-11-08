import _ from "lodash";
import React, { Component } from "react";
import connectData from "../../../restlay/connectData";
import * as api from "../../../data/api-spec";
import PropTypes from "prop-types";
import CircularProgress from "material-ui/CircularProgress";
import "./AccountCreationMembers.css";
import Checkbox from "../../form/Checkbox";
import ModalLoading from "../../../components/ModalLoading";
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
          <p className="info">
            Members define the group of individuals that have the ability to
            approve outgoing operations from this account.
          </p>
        </header>
        <div className="content">
          <Overscroll>
            {_.map(members, member => {
              const isChecked = approvers.indexOf(member.pub_key) > -1;
              return (
                <div
                  key={member.id}
                  onClick={() => addMember(member.pub_key)}
                  role="button"
                  tabIndex={0}
                  className="account-member-row"
                >
                  <div className="member-avatar">
                    <Avatar
                      className="member-avatar-img"
                      url={member.picture}
                      width="13.5px"
                      height="15px"
                    />
                  </div>
                  <span className="name">
                    {member.first_name} {member.last_name}
                  </span>
                  <p className="role"> {member.role} </p>
                  <Checkbox
                    checked={isChecked}
                    id={member.id}
                    labelFor={member.name}
                    handleInputChange={() => addMember(member.pub_key)}
                  />
                </div>
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
  getOrganizationMembers: PropTypes.func.isRequired,
  switchInternalModal: PropTypes.func.isRequired,
  addMember: PropTypes.func.isRequired
};

export default connectData(AccountCreationMembers, {
  RenderLoading: ModalLoading,
  queries: {
    members: api.members
  }
});
