//@flow
import { connect } from "react-redux";
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import BlurDialog from "components/BlurDialog";
import Plus from "../../components/icons/full/Plus";
import AddMember from "./AddMember";
import { Title, Introduction } from "../../components/Onboarding.js";
import People from "../../components/icons/thin/People";
import DialogButton from "components/buttons/DialogButton";
import Footer from "./Footer";
import { addMessage } from "redux/modules/alerts";
import {
  toggleModalProfile,
  addMember,
  editMember,
  getChallengeRegistration
} from "redux/modules/onboarding";
import MemberRow from "components/MemberRow";
import SpinnerCard from "components/spinners/SpinnerCard";
import type { Member } from "data/types";

const styles = {
  add: {
    color: "#27d0e2",
    textDecoration: "none",
    textTransform: "uppercase",
    fontSize: 11,
    fontWeight: 600,
    position: "absolute",
    cursor: "pointer",
    top: 8,
    right: 0
  },
  plus: {
    width: 11,
    marginRight: 10,
    verticalAlign: "middle"
  }
};

const noMembers = {
  base: {
    fontSize: 11,
    lineHeight: 1.82,
    textAlign: "center",
    width: 264,
    margin: "auto",
    marginTop: 110
  },
  label: {
    fontSize: 11,
    fontWeight: 600,
    margin: 0,
    marginBottom: 5,
    textAlign: "center",
    textTransform: "uppercase"
  },
  info: {
    fontSize: 11,
    textAlign: "center",
    lineHeight: 1.82,
    margin: 0
  }
};

const NoMembers = withStyles(
  noMembers
)(({ classes }: { classes: { [$Keys<typeof noMembers>]: string } }) => {
  return (
    <div className={classes.base}>
      <People
        color="#cccccc"
        style={{
          height: 29,
          display: "block",
          margin: "auto",
          marginBottom: 21
        }}
      />
      <div className={classes.label}>Add a new tem member</div>
      <div className={classes.info}>
        At least 3 team members are required to continue
      </div>
    </div>
  );
});

const membersList = {
  base: {
    maxHeight: 272,
    overflow: "auto"
  },
  row: {
    cursor: "pointer"
  }
};
const MembersList = withStyles(
  membersList
)(
  ({
    classes,
    members,
    editMember
  }: {
    classes: { [$Keys<typeof membersList>]: string },
    members: Array<Member>,
    editMember: Function
  }) => {
    return (
      <div className={classes.base}>
        {members.map((member, k) => (
          <MemberRow
            key={k}
            onSelect={() => editMember(member)}
            editable
            member={member}
          />
        ))}
      </div>
    );
  }
);

const mapStateToProps = state => ({
  onboarding: state.onboarding
});
const mapDispatch = (dispatch: *) => ({
  onToggleModalProfile: member => dispatch(toggleModalProfile(member)),
  onAddMember: data => dispatch(addMember(data)),
  onGetChallenge: () => dispatch(getChallengeRegistration()),
  onEditMember: member => dispatch(editMember(member)),
  onAddMessage: (title, message, type) =>
    dispatch(addMessage(title, message, type))
});

type Props = {
  classes: { [$Keys<typeof styles>]: string },
  onToggleModalProfile: Function,
  onAddMember: Function,
  onGetChallenge: Function,
  onEditMember: Function,
  onAddMessage: Function,
  onboarding: *
};
class Registration extends Component<Props, *> {
  componentDidMount() {
    // make an API call to get the challenge needed to register all the new members
    const { onboarding, onGetChallenge } = this.props;
    if (!onboarding.challenge_registration) {
      onGetChallenge();
    }
  }

  addMember = data => {
    this.props.onAddMember(data);
    this.props.onToggleModalProfile();
  };

  editMember = member => {
    this.props.onToggleModalProfile(member);
  };
  render() {
    const {
      classes,
      onboarding,
      onToggleModalProfile,
      onAddMessage,
      onEditMember
    } = this.props;
    if (onboarding.isLoadingChallengeRegistration) {
      return <SpinnerCard />;
    }
    return (
      <div>
        <Title>Registration</Title>
        <BlurDialog
          open={onboarding.modalProfile}
          onClose={onToggleModalProfile}
        >
          <AddMember
            close={onToggleModalProfile}
            finish={this.addMember}
            member={onboarding.editMember}
            editMember={onEditMember}
            setAlert={onAddMessage}
            challenge={onboarding.challenge_registration}
          />
        </BlurDialog>
        <div onClick={() => onToggleModalProfile()} className={classes.add}>
          <Plus className={classes.plus} />Add team member
        </div>
        <Introduction>
          It is now time to add each team member to your company’s Ledger Vault.
          New members will be set as administrators.
          <strong> Once added, administrators cannot be removed.</strong>
        </Introduction>
        {onboarding.members.length === 0 ? (
          <NoMembers />
        ) : (
          <MembersList
            members={onboarding.members}
            editMember={this.editMember}
          />
        )}
        <Footer
          nextState
          render={(onPrev, onNext) => (
            <DialogButton
              highlight
              onTouchTap={onNext}
              disabled={onboarding.members.length < 3}
            >
              Continue
            </DialogButton>
          )}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatch)(
  withStyles(styles)(Registration)
);
