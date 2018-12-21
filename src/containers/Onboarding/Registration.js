//@flow
import { connect } from "react-redux";
import cx from "classnames";
import { translate } from "react-i18next";
import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";
import BlurDialog from "components/BlurDialog";
import AddMember from "./AddMember";
import {
  Title,
  Introduction,
  AddUser,
  Careful,
  NoMembers
} from "components/Onboarding.js";
import DialogButton from "components/buttons/DialogButton";
import Footer from "./Footer";
import { addMessage } from "redux/modules/alerts";
import {
  getRegistrationChallenge,
  addMember,
  wipe,
  editMember,
  toggleMemberModal
} from "redux/modules/onboarding";
import MemberRow from "components/MemberRow";
import SpinnerCard from "components/spinners/SpinnerCard";
import type { Member, Translate } from "data/types";

const styles = {
  disabled: {
    opacity: 0.3,
    pointerEvents: "none"
  }
};

const membersList = {
  base: {
    maxHeight: 272,
    overflow: "auto"
  },
  row: {
    cursor: "pointer"
  }
};
const MembersList = withStyles(membersList)(
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
  onToggleModalProfile: member => dispatch(toggleMemberModal(member)),
  onAddMember: data => dispatch(addMember(data)),
  onWipe: () => dispatch(wipe()),
  onEditMember: data => dispatch(editMember(data)),
  onGetChallenge: () => dispatch(getRegistrationChallenge()),
  onAddMessage: (title, message, type) =>
    dispatch(addMessage(title, message, type))
});

type Props = {
  classes: { [$Keys<typeof styles>]: string },
  onToggleModalProfile: Function,
  onAddMember: Function,
  onGetChallenge: Function,
  history: *,
  onEditMember: Function,
  onAddMessage: Function,
  onboarding: *,
  t: Translate
};
class Registration extends Component<Props, *> {
  componentDidMount() {
    // make an API call to get the challenge needed to register all the new members
    const { onGetChallenge } = this.props;
    onGetChallenge();
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
      history,
      onToggleModalProfile,
      onEditMember,
      onAddMessage,
      t
    } = this.props;
    if (onboarding.fatal_error) {
      return <div />;
    }
    if (!onboarding.registering || !onboarding.registering.challenge) {
      return <SpinnerCard />;
    }
    return (
      <div>
        <Title>{t("onboarding:administrators_registration.title")}</Title>
        <BlurDialog
          open={onboarding.member_modal}
          onClose={onToggleModalProfile}
        >
          <AddMember
            close={onToggleModalProfile}
            finish={this.addMember}
            history={history}
            member={onboarding.editMember}
            editMember={onEditMember}
            setAlert={onAddMessage}
            challenge={onboarding.registering.challenge}
          />
        </BlurDialog>
        <div className={cx({ [classes.disabled]: !onboarding.is_editable })}>
          <AddUser onClick={() => onToggleModalProfile()}>
            {t("onboarding:administrators_registration.add_member")}
          </AddUser>
          <Introduction>
            {t("onboarding:administrators_registration.description")}
            <Careful>
              {t("onboarding:administrators_registration.description_strong")}
            </Careful>
          </Introduction>
          {onboarding.registering.admins.length === 0 ? (
            <NoMembers
              label={t(
                "onboarding:administrators_registration.add_member_title"
              )}
              info={t("onboarding:administrators_registration.at_least")}
            />
          ) : (
            <MembersList
              members={onboarding.registering.admins}
              editMember={this.editMember}
            />
          )}
        </div>
        <Footer
          nextState
          render={(onNext, onPrevious) => (
            <Fragment>
              <DialogButton onTouchTap={onPrevious}>
                {t("common:back")}
              </DialogButton>
              <DialogButton
                highlight
                onTouchTap={onNext}
                disabled={onboarding.registering.admins.length < 3}
              >
                {t("common:continue")}
              </DialogButton>
            </Fragment>
          )}
        />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatch
)(withStyles(styles)(translate()(Registration)));
