// @flow
import React, { useEffect, useState } from "react";

import Box from "components/base/Box";
import { DEVICE_REJECT_ERROR_CODE } from "device";
import TriggerErrorNotification from "components/TriggerErrorNotification";
import ConfirmationCancel from "components/legacy/Onboarding/ConfirmationCancel";
import { generateSeed } from "device/interactions/hsmFlows";
import { SpinnerCentered } from "components/base/Spinner";
import type { Translate } from "data/types";
import { withTranslation, Trans } from "react-i18next";
import { connect } from "react-redux";
import { Title, Introduction } from "components/legacy/Onboarding";
import Fragment from "components/legacy/Onboarding/Fragments";
import DialogButton from "components/legacy/DialogButton";
import {
  toggleDeviceModal,
  addMasterSeedKey,
  wipe,
  openProvisionningChannel,
} from "redux/modules/onboarding";
import { addMessage } from "redux/modules/alerts";
import Footer from "./Footer";

type Props = {
  t: Translate,
  onboarding: *,
  onGetShardsChannel: Function,
  onWipe: Function,
  onAddSeedShard: Function,
};
const Provisioning = ({
  onWipe,
  onboarding,
  t,
  onGetShardsChannel,
  onAddSeedShard,
}: Props) => {
  const [deny, setDeny] = useState(false);
  const [isLoading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    onGetShardsChannel();
  }, [onGetShardsChannel]);

  const onSuccess = data => {
    setLoading(null);
    const {
      blob,
      validate_device,
      u2f_key: { pubKey },
    } = data;

    const send = {
      key_fragment: blob.toString("base64"),
      signature: validate_device.toString("base64"),
      public_key: pubKey.toString("hex"),
    };
    onAddSeedShard(send);
  };

  const onError = e => {
    setLoading(null);
    if (e.statusCode && e.statusCode === DEVICE_REJECT_ERROR_CODE) {
      setDeny(true);
    } else {
      setError(e);
    }
  };

  if (deny) {
    return (
      <ConfirmationCancel
        entity="Administrators"
        step="Master Seed generation"
        toggle={() => setDeny(false)}
        wipe={onWipe}
        title="Generate Master Seed"
      />
    );
  }
  return (
    <Box>
      {error && <TriggerErrorNotification error={error} />}
      <Title>{t("onboarding:master_seed_provisionning.title")}</Title>
      <Introduction>
        <Trans
          i18nKey="onboarding:master_seed_provisionning.description"
          components={<b>0</b>}
        />
      </Introduction>
      {onboarding.provisionning &&
      onboarding.provisionning.channel &&
      Object.keys(onboarding.provisionning.channel).length > 0 ? (
        <Box horizontal mb={35} justify="space-evenly">
          {Array(3)
            .fill()
            .map((v, i) => (
              <Fragment
                // eslint-disable-next-line react/no-array-index-key
                key={i}
                disabled={i !== onboarding.provisionning.blobs.length}
                loading={isLoading === i}
                additionalFields={{
                  secure_channels: onboarding.provisionning.channel,
                }}
                interactions={generateSeed}
                desc={t(`onboarding:master_seed_provisionning.step${i + 1}`)}
                label={t("onboarding:master_seed_provisionning.generate_seed")}
                generated={onboarding.provisionning.blobs.length > i}
                onSuccess={onSuccess}
                onError={onError}
                generate={() => setLoading(i)}
              />
            ))}
        </Box>
      ) : (
        <SpinnerCentered />
      )}
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
              disabled={onboarding.provisionning.blobs.length < 3}
            >
              {t("common:continue")}
            </DialogButton>
          </>
        )}
      />
    </Box>
  );
};

const mapProps = state => ({
  onboarding: state.onboarding,
});

const mapDispatch = (dispatch: *) => ({
  onToggleDeviceModal: () => dispatch(toggleDeviceModal()),
  onAddSeedShard: data => dispatch(addMasterSeedKey(data)),
  onAddMessage: (title, msg, type) => dispatch(addMessage(title, msg, type)),
  onWipe: () => dispatch(wipe()),
  onGetShardsChannel: () => dispatch(openProvisionningChannel()),
});

export default connect(mapProps, mapDispatch)(withTranslation()(Provisioning));
