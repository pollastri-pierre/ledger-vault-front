// @flow
import React from "react";
import ExpandableText from "components/ExpandableText";
import type { Member } from "data/types";
import { withStyles } from "@material-ui/core/styles";
import colors from "shared/colors";
import Question from "../icons/full/Question";
import ValidateBadge from "../icons/full/ValidateBadge";
import MemberAvatar from "../MemberAvatar";

const styles = {
  base: {
    flexShrink: 0,
    borderBottom: `1px solid ${colors.argile}`,
    textAlign: "center",
    position: "relative",
    display: "inline-block",
    width: "85px",
    height: "115px",
    paddingBottom: "40px",
    verticalAlign: "middle"
  },
  status: {
    position: "relative",
    marginBottom: "12px"
  },
  name: {
    display: "block",
    color: "black",
    marginBottom: "4px",
    fontSize: "13px"
  },
  hasApproved: {
    margin: "0",
    fontSize: "11px",
    color: colors.lead
  },
  validated: {
    borderRadius: "50%",
    position: "absolute",
    top: "20px",
    left: "50px",
    width: "11px",
    height: "11px",
    fill: colors.ocean
  },
  pending: {
    borderRadius: "50%",
    position: "absolute",
    left: "50px",
    boxSizing: "content-box",
    width: "11px",
    height: "11px",
    fill: colors.mouse,
    border: "2px solid white",
    top: "17px"
  }
};
function Approvalmember(props: {
  member: Member,
  isApproved: boolean,
  classes: Object
}) {
  const { member, isApproved, classes } = props;

  const name = member.username;
  return (
    <div className={classes.base} data-test="approvalmember">
      <div className={classes.status}>
        <MemberAvatar url={member.picture} />
        {isApproved ? (
          <ValidateBadge className={classes.validated} />
        ) : (
          <Question className={classes.pending} color="#cccccc" />
        )}
      </div>

      <ExpandableText
        text={name}
        size={9}
        className={classes.name}
        dataTest="approvalmember-name"
      />
      {isApproved ? (
        <span className={classes.hasApproved} data-test="approvalmember-status">
          Approved
        </span>
      ) : (
        <span className={classes.hasApproved} data-test="approvalmember-status">
          Pending
        </span>
      )}
    </div>
  );
}

export default withStyles(styles)(Approvalmember);
