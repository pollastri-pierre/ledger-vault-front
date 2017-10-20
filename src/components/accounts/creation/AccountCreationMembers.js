import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CircularProgress from 'material-ui/CircularProgress';
import './AccountCreationMembers.css';
import Checkbox from '../../form/Checkbox';
import { Avatar, DialogButton, Overscroll } from '../../../components';


class AccountCreationMembers extends Component {
  componentWillMount() {
    const { organization, getOrganizationMembers } = this.props;

    if (_.isNull(organization.members) && !organization.isLoading) {
      getOrganizationMembers();
    }
  }

  render() {
    const { switchInternalModal, organization, addMember, members } = this.props;

    if (organization.isLoading || _.isNull(organization.members)) {
      return (
        <div className="account-creation-members wrapper">
          <div className="content">
            <CircularProgress
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginLeft: '-25px',
                marginTop: '-25px',
              }}
            />
          </div>
          <div className="footer">
            <DialogButton right highlight onTouchTap={() => switchInternalModal('main')}>Done</DialogButton>
          </div>
        </div>
      );
    }

    return (
      <div className="account-creation-members wrapper">
        <header>
          <h2>Members</h2>
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
          <Overscroll>
              {_.map(organization.members, (member) => {
                // const isChecked = (!_.isUndefined(_.findIndex(members, member.pub_key)));
                const isChecked = members.indexOf(member.pub_key) > -1;
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
                    <span className="name">{member.firstname} {member.name}</span>
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
          <DialogButton right highlight onTouchTap={() => switchInternalModal('main')}>Done</DialogButton>
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
  addMember: PropTypes.func.isRequired,
};

export default AccountCreationMembers;
