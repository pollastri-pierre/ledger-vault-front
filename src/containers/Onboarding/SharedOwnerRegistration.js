// @flow
import React, { Component } from "react";
import { connect } from "react-redux";

import { NetworkError } from "network";
import type { Translate, Organization, GateError } from "data/types";
import DeviceInteraction from "components/DeviceInteraction";
import { onboardingRegisterFlow } from "device/interactions/hsmFlows";
import Modal from "components/base/Modal";
import { Title, Introduction, NoMembers, AddUser } from "components/Onboarding";
import { withTranslation, Trans } from "react-i18next";
import Box from "components/base/Box";
import InfoBox from "components/base/InfoBox";
import Text from "components/base/Text";
import DialogButton from "components/buttons/DialogButton";
import { addSharedOwner, getState } from "redux/modules/onboarding";
import TriggerErrorNotification from "components/TriggerErrorNotification";
import type { Onboarding } from "redux/modules/onboarding";
import Footer from "./Footer";

type Props = {
  t: Translate,
  organization: Organization,
  onboarding: Onboarding,
  onAddSharedOwner: Function,
  onGetState: Function,
};

type State = {
  registering: boolean,
  error?: Error | GateError | typeof NetworkError,
};
class SharedOwnerRegistration extends Component<Props, State> {
  state = {
    registering: false,
  };

  onToggleRegisteringModal = () => {
    this.setState(state => ({ registering: !state.registering }));
  };

  onError = (e: Error | GateError | typeof NetworkError) => {
    this.onToggleRegisteringModal();
    this.setState({ error: e });
    // we refresh the state because gate might wipe if hsm exception
    this.props.onGetState();
  };

  add = data => {
    this.onToggleRegisteringModal();
    this.props.onAddSharedOwner(data.register_input);
  };

  render() {
    const { t, onboarding, organization } = this.props;
    const { registering } = this.state;
    if (onboarding.fatal_error) {
      return <div />;
    }
    return (
      <div>
        {this.state.error && (
          <TriggerErrorNotification error={this.state.error} />
        )}
        <Modal isOpened={registering} onClose={this.onToggleRegisteringModal}>
          <Box flow={40} p={30} pb={80} width={500}>
            <Text small uppercase>
              Register Shared-Owner
            </Text>
            <Box align="center">
              <DeviceInteraction
                onSuccess={this.add}
                interactions={onboardingRegisterFlow}
                onError={this.onError}
                additionalFields={{
                  organization,
                  username: `Shared-Owner ${
                    onboarding.registering_shared_owner.sharedOwners
                      ? onboarding.registering_shared_owner.sharedOwners
                          .length + 1
                      : 1
                  }`,
                  role: "shared_owner",
                }}
              />
            </Box>
          </Box>
        </Modal>
        <Title>{t("onboarding:so_registration.title")}</Title>
        <Introduction>
          <Trans
            i18nKey="onboarding:so_registration.desc"
            components={<strong>0</strong>}
          />
          <InfoBox withIcon type="info" style={{ marginTop: 20 }}>
            {t("onboarding:so_registration.description_strong")}
          </InfoBox>
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
              key={i} // eslint-disable-line react/no-array-index-key
              style={{
                lineHeight: "45px",
                borderBottom: "1px solid #eeeeee",
                fontSize: 11,
                textTransform: "uppercase",
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
                  verticalAlign: "middle",
                }}
              />
              Shared-Owner {i + 1}
            </div>
          ))}
        </div>
        <Footer
          render={(onNext, onPrevious) => (
            <>
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
            </>
          )}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  onboarding: state.onboarding,
});

const mapDispatchToProps = (dispatch: *) => ({
  onAddSharedOwner: data => dispatch(addSharedOwner(data)),
  onGetState: () => dispatch(getState()),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(SharedOwnerRegistration));
