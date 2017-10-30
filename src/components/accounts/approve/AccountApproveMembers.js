import React, { Component } from "react";
import PropTypes from "prop-types";
import CircularProgress from "material-ui/CircularProgress";
import _ from "lodash";
import { Avatar } from "../../../components";

class AccountApproveMembers extends Component {
  componentWillMount() {
    const { members, isLoading } = this.props.organization;

    if (!isLoading && _.isNull(members)) {
      this.props.getOrganizationMembers();
    }
  }

  render() {
    const { members, isLoading } = this.props.organization;
    const membersAccount = this.props.account.security.members;

    if (isLoading || _.isNull(members)) {
      return (
        <CircularProgress
          style={{
            top: "50%",
            left: "50%",
            margin: "-25px 0 0 -25px"
          }}
        />
      );
    }

    return (
      <div className="account-creation-members">
        <p className="info approve">
          Members define the group of individuals that have the ability to
          approve outgoing operations from this account.
        </p>
        {_.map(membersAccount, hash => {
          const member = _.find(members, { pub_key: hash });
          return (
            <div
              key={member.id}
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
                {member.firstname} {member.name}
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
