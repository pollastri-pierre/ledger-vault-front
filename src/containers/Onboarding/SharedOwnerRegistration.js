//@flow
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import Footer from "./Footer";
import type { Translate } from "data/types";
import { Title, Introduction } from "components/Onboarding.js";
import { translate } from "react-i18next";
import BlurDialog from "components/BlurDialog";
import RegisterAdmins from "containers/Onboarding/RegisterAdmins";
import { NoMembers, AddUser } from "components/Onboarding";
import DialogButton from "components/buttons/DialogButton";
import {
  getRegistrationChallenge,
  addSharedOwner
} from "redux/modules/onboarding";
import type { Onboarding } from "redux/modules/onboarding";

type Props = {
  t: Translate,
  onboarding: Onboarding,
  onAddSharedOwner: Function
};

type State = {
  registering: boolean
};
class SharedOwnerRegistration extends Component<Props, State> {
  state = {
    registering: false
  };

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
    return (
      <div>
        <BlurDialog open={registering} onClose={this.onToggleRegisteringModal}>
          <RegisterAdmins
            title="Register Shared-Owner"
            close={this.onToggleRegisteringModal}
            cancel={this.onToggleRegisteringModal}
            challenge="challenge"
            finish={this.add}
          />
        </BlurDialog>
        <Title>{t("onboarding:so_registration.title")}</Title>
        <Introduction>
          <p>{t("onboarding:so_registration.desc1")}</p>
          <p>{t("onboarding:so_registration.desc2")}</p>
          <strong>{t("onboarding:so_registration.description_strong")}</strong>
        </Introduction>
        {onboarding.sharedOwners.length < 3 && (
          <AddUser onClick={this.onToggleRegisteringModal}>
            {t("onboarding:so_registration.add")}
          </AddUser>
        )}
        <div>
          {onboarding.sharedOwners.length === 0 && (
            <NoMembers
              label={t("onboarding:so_registration.add_new")}
              info={t("onboarding:so_registration.so_nb_required")}
            />
          )}
          {onboarding.sharedOwners.map((so, i) => (
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
                disabled={onboarding.sharedOwners.length < 3}
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
  onGetChallenge: () => dispatch(getRegistrationChallenge())
});
export default connect(mapStateToProps, mapDispatchToProps)(
  translate()(SharedOwnerRegistration)
);
