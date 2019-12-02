// @flow
import React, { useState, useEffect } from "react";
import styled from "styled-components";

import ConfirmationCancel from "components/legacy/Onboarding/ConfirmationCancel";
import { DEVICE_REJECT_ERROR_CODE } from "device";
import CircleProgress from "components/legacy/CircleProgress";
import type { Translate } from "data/types";
import { withTranslation } from "react-i18next";
import DialogButton from "components/legacy/DialogButton";
import TriggerErrorNotification from "components/TriggerErrorNotification";
import { FaPlus } from "react-icons/fa";
import DeviceInteraction from "components/DeviceInteraction";
import { validateOperation } from "device/interactions/hsmFlows";
import { SpinnerCentered } from "components/base/Spinner";
import Box from "components/base/Box";
import Text from "components/base/Text";
import { connect } from "react-redux";
import {
  openAdminValidationChannel,
  wipe,
  toggleDeviceModal,
  addAdminValidation,
} from "redux/modules/onboarding";
import { addMessage } from "redux/modules/alerts";
import { Title, Introduction } from "components/Onboarding";
import colors from "shared/colors";
import Footer from "./Footer";

type Props = {
  onboarding: *,
  onWipe: Function,
  onOpenAdminValidationChannel: Function,
  onOpenAdminValidationChannel: () => void,
  onAddAdminValidation: (string, string) => void,
  t: Translate,
};
const SharedOwnerValidation = ({
  t,
  onboarding,
  onWipe,
  onOpenAdminValidationChannel,
  onAddAdminValidation,
}: Props) => {
  const [deny, setDeny] = useState(false);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState(null);

  const onSuccess = data => {
    setValidating(false);
    onAddAdminValidation(
      data.u2f_key.pubKey,
      data.validate_device.toString("base64"),
    );
  };
  const onError = e => {
    setValidating(false);
    if (e.statusCode && e.statusCode === DEVICE_REJECT_ERROR_CODE) {
      setDeny(true);
    } else {
      setError(e);
    }
  };

  useEffect(() => {
    onOpenAdminValidationChannel();
  }, [onOpenAdminValidationChannel]);

  if (deny) {
    return (
      <ConfirmationCancel
        entity="Shared-Owners"
        toggle={() => setDeny(false)}
        wipe={onWipe}
        step="Shared-Owner registration confirmation"
        title="Shared-Owners registration confirmation"
      />
    );
  }
  return (
    <Box>
      {error && <TriggerErrorNotification error={error} />}
      <Title>{t("onboarding:so_validation.title")}</Title>
      <Introduction>{t("onboarding:so_validation.desc")}</Introduction>
      {onboarding.validating_shared_owner &&
      onboarding.validating_shared_owner.channels &&
      Object.keys(onboarding.validating_shared_owner.channels).length > 0 ? (
        <Box horizontal justify="space-between" mb={50} flow={50}>
          <Box>
            <CircleProgress
              label={t("onboarding:master_seed_signin.members_present")}
              nb={onboarding.validating_shared_owner.admins.length}
              total={onboarding.quorum}
            />
          </Box>
          <Box>
            <strong>{t("onboarding:master_seed_signin.ask_admin")}</strong>
            <Sep />
            <Box>
              {validating ? (
                <DeviceInteraction
                  onSuccess={onSuccess}
                  onError={onError}
                  noCheckVersion
                  interactions={validateOperation()}
                  additionalFields={{
                    secure_channels:
                      onboarding.validating_shared_owner.channels,
                  }}
                />
              ) : (
                <>
                  <SigninButton
                    disabled={
                      onboarding.validating_shared_owner.admins.length ===
                      onboarding.quorum
                    }
                    onClick={() => setValidating(true)}
                  >
                    <FaPlus size={12} />
                    {onboarding.validating_shared_owner.admins.length === 0 ? (
                      <span className="test-onboarding-signin">
                        {t("onboarding:master_seed_signin.signin")}
                      </span>
                    ) : (
                      <span className="test-onboarding-signin">
                        {t("onboarding:master_seed_signin.signin_next")}
                      </span>
                    )}
                  </SigninButton>
                  <Text size="small" color={colors.steel}>
                    {onboarding.validating_shared_owner.admins.length}{" "}
                    {t("onboarding:master_seed_signin.signed_in")},{" "}
                    {onboarding.quorum -
                      onboarding.validating_shared_owner.admins.length}{" "}
                    {t("onboarding:master_seed_signin:remaining")}
                  </Text>
                </>
              )}
            </Box>
          </Box>
        </Box>
      ) : (
        <SpinnerCentered />
      )}

      <Footer
        isBack={false}
        render={(onNext, onPrevious) => (
          <>
            <DialogButton onTouchTap={onPrevious}>
              {t("common:back")}
            </DialogButton>
            <DialogButton
              highlight
              onTouchTap={onNext}
              disabled={
                onboarding.validating_shared_owner.admins.length <
                onboarding.quorum
              }
            >
              {t("common:continue")}
            </DialogButton>
          </>
        )}
      />
    </Box>
  );
};

const mapState = state => ({
  onboarding: state.onboarding,
});

const mapDispatch = (dispatch: *) => ({
  onOpenAdminValidationChannel: () => dispatch(openAdminValidationChannel()),
  onToggleSignin: () => dispatch(toggleDeviceModal()),
  onAddAdminValidation: (key, sign) => dispatch(addAdminValidation(key, sign)),
  onWipe: () => dispatch(wipe()),
  onAddMessage: (title, message, type) =>
    dispatch(addMessage(title, message, type)),
});

export default connect(
  mapState,
  mapDispatch,
)(withTranslation()(SharedOwnerValidation));

const SigninButton = styled(Box).attrs({
  horizontal: true,
  flow: 5,
  align: "center",
})`
  opacity: ${p => (p.disabled ? "0.5" : "1")};
  pointer-events: ${p => (p.disabled ? "none" : "auto")};
  cursor: ${p => (p.disabled ? "default" : "pointer")};
  font-size: 11px;
  text-transform: uppercase;
  color: ${colors.ocean};
  fontweight: 600;
`;

const Sep = styled.div`
  width: 220px;
  height: 1;
  background: ${colors.argile};
  margin: 20px 0 20px 0;
`;
