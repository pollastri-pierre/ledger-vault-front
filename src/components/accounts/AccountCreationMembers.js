import _ from 'lodash';
import React, { Component } from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import './AccountCreationMembers.css';
import { DialogButton } from '../';
import Checkbox from '../form/Checkbox';
import { Avatar } from '../../components';

console.log(Avatar);

class AccountCreationMembers extends Component {
  componentWillMount() {
    const { organization, getOrganizationMembers, members } = this.props;

    if (_.isNull(organization.members) && !organization.isLoading) {
      getOrganizationMembers();
    }
  }

  render() {
    const { switchInternalModal, organization, addMember, members } = this.props;

    if (organization.isLoading || _.isNull(organization.members)) {
      return (
        <div className="account-creation-members">
          <div className="modal-loading">
            <CircularProgress />
          </div>
          <div className="footer">
            <DialogButton right highlight onTouchTap={() => switchInternalModal('main')}>Done</DialogButton>
          </div>
        </div>
      );
    }

    return (
      <div className="account-creation-members">
        <div>
          <header>
          <h3>Members</h3>
          {(members.length > 0) ?
            <span className="counter">{members.length} members selected</span>
            :
            false
          }
          <p className="info">
            Members define the group of individuals that have the ability to
            approve outgoing operations from this account.
          </p>
          </header>
          <div className="content">
            <div className="inner">
              {_.map(organization.members, (member) => {
                const isChecked = (!_.isUndefined(_.find(members, { id: member.id })));
                return (
                  <div
                    key={member.id}
                    onClick={() => addMember(member)}
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
                    <span className="name"> {member.firstname} {member.name} </span>
                    <p className="role"> {member.role} </p>
                    <Checkbox
                      checked={isChecked}
                      id={member.id}
                      labelFor={member.name}
                      handleInputChange={() => addMember(member)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="footer">
          <DialogButton right highlight onTouchTap={() => switchInternalModal('main')}>Done</DialogButton>
        </div>
      </div>
    );
  }
}

export default AccountCreationMembers;
