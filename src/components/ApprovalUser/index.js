//@flow
import React from "react";
import MemberAvatar from "../MemberAvatar";
import ValidateBadge from "../icons/full/ValidateBadge";
import ExpandableText from "components/ExpandableText";
import Question from "../icons/full/Question";
import type { Member } from "data/types";
import { withStyles } from "@material-ui/core/styles";
import colors from "shared/colors";

const styles = {
  base: {
    borderBottom: `1px solid ${colors.argile}`,
    textAlign: "center",
    position: "relative",
    display: "inline-block",
    width: "85px",
    height: "115px",
    margin: "15px",
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

  const name = member.first_name + " " + member.last_name;
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

      {/* <span className={classes.name}>{slice}</span> */}
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
