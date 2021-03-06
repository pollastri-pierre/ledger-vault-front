//@flow
import React, { Component } from "react";
import MemberAvatar from "../MemberAvatar";
import MemberRole from "../MemberRole";
import Checkbox from "../form/Checkbox";
import type { Member } from "data/types";
import { withStyles } from "material-ui/styles";
import classnames from "classnames";
import colors from "shared/colors";

const styles = {
  base: {
    borderBottom: `1px solid ${colors.argile}`,
    outline: "none",
    cursor: "pointer",
    height: "70px",
    position: "relative",
    paddingLeft: "50px",
    "& .membrer-avatar": {
      position: "absolute",
      top: "21px",
      left: "0"
    },
    "& .slidebox": {
      float: "right",
      marginTop: "-20px"
    },
    "&:last-child": {
      border: "0"
    }
  },
  notSelect: {
    cursor: "default"
  },
  name: {
    display: "inline-block",
    marginTop: "17px",
    marginBottom: "4px",
    color: "black",
    fontSize: "13px"
  },
  role: {
    margin: "0",
    fontSize: "11px",
    color: colors.lead
  },
  avatar: {
    position: "absolute",
    top: "21px",
    left: "0"
  },
  checkbox: {
    position: "absolute",
    right: "0",
    top: "10px"
  }
};
class MemberRow extends Component<{
  onSelect?: (pub_key: string) => void,
  checked?: boolean,
  member: Member,
  classes: Object
}> {
  onClick = () => {
    const { onSelect } = this.props;
    if (onSelect) onSelect(this.props.member.pub_key);
  };

  render() {
    const { member, onSelect, checked, classes } = this.props;

    return (
      <div
        className={classnames(classes.base, { [classes.notSelect]: !onSelect })}
        onClick={this.onClick}
      >
        <MemberAvatar url={member.picture} className={classes.avatar} />
        <span className={classes.name}>
          {member.first_name} {member.last_name}
        </span>
        <p className={classes.role}>
          <MemberRole member={member} />
        </p>
        {onSelect && (
          <Checkbox
            checked={checked}
            className={classes.checkbox}
            labelFor={member.id}
            handleInputChange={this.onClick}
          />
        )}
      </div>
    );
  }
}

export default withStyles(styles)(MemberRow);
