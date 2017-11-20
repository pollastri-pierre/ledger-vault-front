//@flow
import React, { Component } from "react";
import MemberAvatar from "../MemberAvatar";
import MemberRole from "../MemberRole";
import Checkbox from "../form/Checkbox";
import type { Member } from "../../data/types";
import "./index.css";

class MemberRow extends Component<{
  onSelect?: (pub_key: string) => void,
  checked?: boolean,
  member: Member
}> {
  onClick = () => {
    const { onSelect } = this.props;
    if (onSelect) onSelect(this.props.member.pub_key);
  };

  render() {
    const { member, onSelect, checked } = this.props;

    return (
      <div
        className={`member-row ${!onSelect ? "not-select" : ""}`}
        onClick={this.onClick}
      >
        <MemberAvatar url={member.picture} />
        <span className="name">
          {member.first_name} {member.last_name}
        </span>
        <p className="role">
          <MemberRole member={member} />
        </p>
        {onSelect && (
          <Checkbox
            checked={checked}
            labelFor={member.id}
            handleInputChange={this.onClick}
          />
        )}
      </div>
    );
  }
}

export default MemberRow;
