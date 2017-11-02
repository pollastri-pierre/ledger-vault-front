import React, { Component } from "react";
import PropTypes from "prop-types";
import CircularProgress from "material-ui/CircularProgress";
import _ from "lodash";
import { Avatar } from "../../../components";
import MemberAvatar from "../../MemberAvatar";
import InfoModal from "../../InfoModal";

class AccountApproveMembers extends Component {
  render() {
    const { members } = this.props;
    const membersAccount = this.props.account.security_scheme.approvers;

    return (
      <div className="account-creation-members">
        <InfoModal>
          Members define the group of individuals that have the ability to
          approve outgoing operations from this account.
        </InfoModal>
        {_.map(membersAccount, hash => {
          const member = _.find(members, { pub_key: hash });
          return (
            <div
              key={member.id}
              role="button"
              tabIndex={0}
              className="account-member-row"
            >
              <MemberAvatar url={member.picture} />
              <span className="name">
                {member.first_name} {member.last_name}
              </span>
              <p className="role">{member.role}</p>
            </div>
          );
        })}
      </div>
    );
  }
}

AccountApproveMembers.propTypes = {
  organization: PropTypes.shape({
    members: PropTypes.arrayOf(PropTypes.shape({})),
    isLoading: PropTypes.bool
  }).isRequired,
  account: PropTypes.shape({
    security: PropTypes.shape({
      members: PropTypes.arrayOf(PropTypes.string)
    })
  }).isRequired,
  getOrganizationMembers: PropTypes.func.isRequired
};

export default AccountApproveMembers;
