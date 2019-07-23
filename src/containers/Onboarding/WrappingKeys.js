// @flow
import React, { useEffect, useState } from "react";
import TriggerErrorNotification from "components/TriggerErrorNotification";
import { generateWrappingKeyFlow } from "device/interactions/generateWrappingKeys";
import { withTranslation, Trans } from "react-i18next";
import type { Translate } from "data/types";
import Box from "components/base/Box";
import { Title, Introduction } from "components/Onboarding";
import DialogButton from "components/buttons/DialogButton";
import { connect } from "react-redux";
import SpinnerCard from "components/spinners/SpinnerCard";
import Fragment from "containers/Onboarding/Fragments";
import {
  openWrappingChannel,
  toggleDeviceModal,
  addWrappingKey,
} from "redux/modules/onboarding";
import { addMessage } from "redux/modules/alerts";
import Footer from "./Footer";

type Props = {
  onboarding: *,
  onGetWrapsChannel: Function,
  onAddWrapShard: Function,
  t: Translate,
};

const mapState = state => ({
  onboarding: state.onboarding,
});
const mapDispatch = (dispatch: *) => ({
  onGetWrapsChannel: () => dispatch(openWrappingChannel()),
  onAddWrapShard: data => dispatch(addWrappingKey(data)),
  onToggleDeviceModal: () => dispatch(toggleDeviceModal()),
  onAddMessage: (title, content, success) =>
    dispatch(addMessage(title, content, success)),
});

const WrappingKeys = ({
  onboarding,
  t,
  onGetWrapsChannel,
  onAddWrapShard,
}: Props) => {
  const [isLoading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    onGetWrapsChannel();
  }, [onGetWrapsChannel]);

  const onSuccess = data => {
    onAddWrapShard(data.fragment);
    setLoading(null);
  };

  const onError = e => {
    setLoading(null);
    setError(e);
  };
  return (
    <Box>
      {error && <TriggerErrorNotification error={error} />}
      <Title>
        <Trans i18nKey="onboarding:wrapping_key.title" />
      </Title>
      <Introduction>
        <Trans
          i18nKey="onboarding:wrapping_key.description"
          components={<strong>0</strong>}
        />
      </Introduction>
      {onboarding.wrapping &&
      onboarding.wrapping.channel &&
      onboarding.wrapping.channel.ephemeral_certificate ? (
        <Box justify="space-between" mb={50} horizontal>
          {Array(3)
            .fill()
            .map((v, i) => (
              <Box
                key={i} // eslint-disable-line react/no-array-index-key
              >
                <Fragment
                  disabled={i !== onboarding.wrapping.blobs.length}
                  loading={isLoading === i}
                  onError={onError}
                  additionalFields={{
                    secure_channel: onboarding.wrapping.channel,
                  }}
                  interactions={generateWrappingKeyFlow}
                  label={t("onboarding:wrapping_key.generate")}
                  generated={onboarding.wrapping.blobs.length > i}
                  onSuccess={onSuccess}
                  generate={() => setLoading(i)}
                />
              </Box>
            ))}
        </Box>
      ) : (
        <SpinnerCard />
      )}
      <Footer
        render={(onNext, onPrevious) => (
          <>
            <DialogButton onTouchTap={onPrevious}>
              {t("common:back")}
            </DialogButton>
            <DialogButton
              highlight
              onTouchTap={onNext}
              disabled={onboarding.wrapping.blobs.length < 3}
            >
              {t("common:continue")}
            </DialogButton>
          </>
        )}
      />
    </Box>
  );
};

// useful for test
export { WrappingKeys };

export default connect(
  mapState,
  mapDispatch,
)(withTranslation()(WrappingKeys));
