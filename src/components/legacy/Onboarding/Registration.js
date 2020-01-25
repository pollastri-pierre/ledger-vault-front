// @flow
import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { withTranslation } from "react-i18next";

import { addMessage } from "redux/modules/alerts";
import Modal from "components/base/Modal";
import {
  Title,
  Introduction,
  AddUser,
  NoMembers,
} from "components/legacy/Onboarding";
import DialogButton from "components/legacy/DialogButton";
import Disabled from "components/Disabled";
import {
  getRegistrationChallenge,
  addMember,
  wipe,
  toggleMemberModal,
} from "redux/modules/onboarding";
import MemberRow from "components/MemberRow";
import type { User, Translate, Organization } from "data/types";
import Footer from "./Footer";
import AddMember from "./AddMember";

const MemeberListContainer = styled.div`
  max-height: 272px;
  overflow: auto;
`;
const MembersList = ({ members }: { members: Array<User> }) => (
  <MemeberListContainer>
    {members.map((member, k) => (
      <MemberRow
        key={k} // eslint-disable-line react/no-array-index-key
        member={member}
      />
    ))}
  </MemeberListContainer>
);

const mapStateToProps = state => ({
  onboarding: state.onboarding,
});
const mapDispatch = (dispatch: *) => ({
  onToggleModalProfile: member => dispatch(toggleMemberModal(member)),
  onAddMember: data => dispatch(addMember(data)),
  onWipe: () => dispatch(wipe()),
  onGetChallenge: () => dispatch(getRegistrationChallenge()),
  onAddMessage: (title, message, type) =>
    dispatch(addMessage(title, message, type)),
});

type Props = {
  onToggleModalProfile: Function,
  organization: Organization,
  onAddMember: Function,
  history: *,
  onEditMember: Function,
  onAddMessage: Function,
  onboarding: *,
  t: Translate,
};
class Registration extends Component<Props, *> {
  addMember = data => {
    this.props.onAddMember(data);
    this.props.onToggleModalProfile();
  };

  render() {
    const {
      onboarding,
      history,
      onToggleModalProfile,
      organization,
      onEditMember,
      onAddMessage,
      t,
    } = this.props;
    if (onboarding.fatal_error) {
      return <div />;
    }
    return (
      <div>
        <Title>{t("onboarding:administrators_registration.title")}</Title>
        <Modal
          isOpened={onboarding.member_modal}
          onClose={onToggleModalProfile}
        >
          <AddMember
            close={onToggleModalProfile}
            organization={organization}
            finish={this.addMember}
            history={history}
            editMember={onEditMember}
            setAlert={onAddMessage}
            challenge={onboarding.registering.challenge}
          />
        </Modal>
        <Disabled disabled={!onboarding.is_editable}>
          <AddUser onClick={() => onToggleModalProfile()}>
            {t("onboarding:administrators_registration.add_member")}
          </AddUser>
          <Introduction>
            {t("onboarding:administrators_registration.description")}
          </Introduction>
          {onboarding.registering.admins.length === 0 ? (
            <NoMembers
              label={t(
                "onboarding:administrators_registration.add_member_title",
              )}
              info={t("onboarding:administrators_registration.at_least")}
            />
          ) : (
            <MembersList members={onboarding.registering.admins} />
          )}
        </Disabled>
        <Footer
          nextState
          render={(onNext, onPrevious) => (
            <>
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
            </>
          )}
        />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatch,
)(withTranslation()(Registration));
