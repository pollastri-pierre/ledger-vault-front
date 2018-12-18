//@flow
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

import Footer from "./Footer";
import type { Translate } from "data/types";
import { Title, Careful, Introduction } from "components/Onboarding.js";
import { translate, Trans } from "react-i18next";
import SpinnerCard from "components/spinners/SpinnerCard";
import BlurDialog from "components/BlurDialog";
import RegisterAdmins from "containers/Onboarding/RegisterAdmins";
import { NoMembers, AddUser } from "components/Onboarding";
import DialogButton from "components/buttons/DialogButton";
import {
  getSharedOwnerRegistrationChallenge,
  addSharedOwner
} from "redux/modules/onboarding";
import type { Onboarding } from "redux/modules/onboarding";

type Props = {
  t: Translate,
  onboarding: Onboarding,
  onAddSharedOwner: Function,
  onGetChallenge: Function
};

type State = {
  registering: boolean
};
class SharedOwnerRegistration extends Component<Props, State> {
  state = {
    registering: false
  };

  componentDidMount() {
    const { onGetChallenge } = this.props;
    onGetChallenge();
  }

  onToggleRegisteringModal = () => {
    this.setState({ registering: !this.state.registering });
  };

  add = data => {
    this.onToggleRegisteringModal();
    this.props.onAddSharedOwner(data);
  };

  render() {
    const { t, onboarding } = this.props;
    const { registering } = this.state;
    if (onboarding.fatal_error) {
      return <div />;
    }
    if (
      !onboarding.registering_shared_owner ||
      !onboarding.registering_shared_owner.challenge
    ) {
      return <SpinnerCard />;
    }
    return (
      <div>
        <BlurDialog open={registering} onClose={this.onToggleRegisteringModal}>
          <RegisterAdmins
            title="Register Shared-Owner"
            role="Shared-Owner"
            close={this.onToggleRegisteringModal}
            cancel={this.onToggleRegisteringModal}
            challenge={onboarding.registering_shared_owner.challenge}
            finish={this.add}
          />
        </BlurDialog>
        <Title>{t("onboarding:so_registration.title")}</Title>
        <Introduction>
          <Trans
            i18nKey="onboarding:so_registration.desc"
            components={<strong>0</strong>}
          />
          <Careful>
            {t("onboarding:so_registration.description_strong")}
          </Careful>
        </Introduction>
        {onboarding.registering_shared_owner.sharedOwners.length < 3 && (
          <AddUser onClick={this.onToggleRegisteringModal}>
            {t("onboarding:so_registration.add")}
          </AddUser>
        )}
        <div>
          {onboarding.registering_shared_owner.sharedOwners.length === 0 && (
            <NoMembers
              label={t("onboarding:so_registration.add_new")}
              info={t("onboarding:so_registration.so_nb_required")}
            />
          )}
          {onboarding.registering_shared_owner.sharedOwners.map((so, i) => (
            <div
              key={i}
              style={{
                lineHeight: "45px",
                borderBottom: "1px solid #eeeeee",
                fontSize: 11,
                textTransform: "uppercase"
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  background: "#27d0e2",
                  display: "inline-block",
                  marginRight: 10,
                  borderRadius: "50%",
                  verticalAlign: "middle"
                }}
              />
              Shared-Owner {i + 1}
            </div>
          ))}
        </div>
        <Footer
          render={(onNext, onPrevious) => (
            <Fragment>
              <DialogButton onTouchTap={onPrevious}>
                {t("common:back")}
              </DialogButton>
              <DialogButton
                highlight
                onTouchTap={onNext}
                disabled={
                  onboarding.registering_shared_owner.sharedOwners.length < 3
                }
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

const mapStateToProps = state => ({
  onboarding: state.onboarding
});

const mapDispatchToProps = (dispatch: *) => ({
  onAddSharedOwner: data => dispatch(addSharedOwner(data)),
  onGetChallenge: () => dispatch(getSharedOwnerRegistrationChallenge())
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(translate()(SharedOwnerRegistration));
