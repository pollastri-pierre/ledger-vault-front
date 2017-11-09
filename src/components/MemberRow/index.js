//@flow
import React, { Component } from "react";
import MemberAvatar from "../MemberAvatar";
import Checkbox from "../form/Checkbox";
import "./index.css";

class MemberRow extends Component<*> {
  props: {
    onSelect?: Function,
    checked?: boolean,
    member: *
  };

  click = () => {
    const { member, onSelect } = this.props;
    if (onSelect) {
      onSelect(member.pub_key);
    }
  };

  render() {
    const { member, onSelect, checked } = this.props;

    return (
      <div className="member-row" onClick={this.click}>
        <MemberAvatar url={member.picture} />
        <span className="name">
          {member.first_name} {member.last_name}
        </span>
        <p className="role">{member.role}</p>
        {onSelect && (
          <Checkbox
            checked={checked}
            id={member.id}
            labelFor={member.name}
            handleInputChange={() => this.test(member.pub_key)}
          />
        )}
      </div>
    );
  }
}

export default MemberRow;
