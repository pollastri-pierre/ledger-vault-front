// @flow
import React, { Component } from "react";
import { withTranslation, Trans } from "react-i18next";
import type { Translate } from "data/types";
import { withStyles } from "@material-ui/core/styles";
import FragmentKey from "containers/Onboarding/Fragment";
import BlurDialog from "components/BlurDialog";
import { Title, Introduction } from "components/Onboarding";
import DialogButton from "components/buttons/DialogButton";
import { connect } from "react-redux";
import SpinnerCard from "components/spinners/SpinnerCard";
import {
  openWrappingChannel,
  toggleDeviceModal,
  addWrappingKey,
} from "redux/modules/onboarding";
import { addMessage } from "redux/modules/alerts";
import Footer from "./Footer";
import GenerateKeyFragments from "./GenerateKeyFragments";

const styles = {
  flex: { display: "flex", justifyContent: "space-between", marginBottom: 50 },
  disabled: {
    opacity: 0.5,
    cursor: "default",
  },
  icon: {
    width: 10,
    marginRight: 5,
  },
  counter: {
    fontSize: 11,
    color: "#767676",
  },
  signin_desc: {
    fontSize: 12,
    marginBottom: 15,
  },
  title: {
    fontSize: 13,
    fontWeight: 600,
    margin: "0 0 12px 0",
  },
  flexWrapper: {
    flex: 1,
  },
  separator: {
    width: 1,
    height: 94,
    background: "#eeeeee",
  },
  sign: {
    fontSize: 11,
    color: "#27d0e2",
    fontWeight: 600,
    textDecoration: "none",
    textTransform: "uppercase",
    display: "block",
    cursor: "pointer",
  },
  sep: {
    width: 220,
    height: 1,
    background: "#eeeeee",
    margin: "20px 0 20px 0",
  },
};

type Props = {
  onboarding: *,
  onGetWrapsChannel: Function,
  onAddWrapShard: Function,
  onToggleDeviceModal: Function,
  onAddMessage: Function,
  history: *,
  t: Translate,
  classes: { [$Keys<typeof styles>]: string },
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
class WrappingKeys extends Component<Props> {
  componentDidMount() {
    const { onGetWrapsChannel } = this.props;
    onGetWrapsChannel();
  }

  finish = (data: any) => {
    this.props.onToggleDeviceModal();
    this.props.onAddWrapShard(data);
  };

  render() {
    const {
      onboarding,
      onAddMessage,
      history,
      onToggleDeviceModal,
      classes,
      t,
    } = this.props;
    if (
      !onboarding.wrapping.channel ||
      !onboarding.wrapping.channel.ephemeral_public_key ||
      !onboarding.wrapping.channel.ephemeral_certificate
    ) {
      return <SpinnerCard />;
    }
    return (
      <div>
        <Title>{t("onboarding:wrapping_key.title")}</Title>
        <BlurDialog
          open={onboarding.device_modal}
          onClose={onToggleDeviceModal}
        >
          <GenerateKeyFragments
            shards_channel={onboarding.wrapping.channel}
            onFinish={this.finish}
            cancel={onToggleDeviceModal}
            history={history}
            addMessage={onAddMessage}
            wraps
          />
        </BlurDialog>
        <Introduction>
          <Trans
            i18nKey="onboarding:wrapping_key.description"
            components={<strong>0</strong>}
          />
        </Introduction>
        <div className={classes.flex}>
          {Array(3)
            .fill()
            .map((v, i) => (
              <FragmentKey
                key={i} // eslint-disable-line react/no-array-index-key
                disabled={onboarding.wrapping.blobs.length <= i - 1}
                label={t(`onboarding:wrapping_key.step${i + 1}`)}
                labelGenerate={t("onboarding:wrapping_key.generate")}
                generate={onToggleDeviceModal}
                generated={onboarding.wrapping.blobs.length > i}
              />
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
                disabled={onboarding.wrapping.blobs.length < 3}
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

// useful for test
export { WrappingKeys };

export default connect(
  mapState,
  mapDispatch,
)(withStyles(styles)(withTranslation()(WrappingKeys)));
