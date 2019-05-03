// @flow
import BlurDialog from "components/BlurDialog";
import ConfirmationCancel from "containers/Onboarding/ConfirmationCancel";
import SpinnerCard from "components/spinners/SpinnerCard";
import type { Translate } from "data/types";
import FragmentKey from "containers/Onboarding/Fragment";
import { translate, Trans } from "react-i18next";
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { Title, Introduction } from "components/Onboarding";
import DialogButton from "components/buttons/DialogButton";
import {
  toggleDeviceModal,
  addMasterSeedKey,
  wipe,
  openProvisionningChannel,
} from "redux/modules/onboarding";
import { addMessage } from "redux/modules/alerts";
import Footer from "./Footer";
import GenerateSeedDevice from "./GenerateSeedDevice";

const styles = {
  steps: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 35,
  },
  title: {
    fontSize: 12,
    fontWeight: 600,
    margin: "0 0 12px 0",
  },
  step: {
    paddingRight: 13,
    paddingLeft: 25,
    "&:first-child": {
      paddingLeft: 0,
    },
    transition: "all 200ms ease",
  },
  disabled: {
    opacity: 0.2,
  },
  separator: {
    width: 1,
    height: 94,
    background: "#eeeeee",
  },
};
type Props = {
  classes: { [$Keys<typeof styles>]: string },
  t: Translate,
  onboarding: *,
  onToggleDeviceModal: Function,
  onGetShardsChannel: Function,
  onWipe: Function,
  history: *,
  onAddMessage: (string, string, string) => void,
  onAddSeedShard: Function,
};
type State = {
  deny: boolean,
};
class Provisioning extends Component<Props, State> {
  state = {
    deny: false,
  };

  finish = data => {
    this.props.onToggleDeviceModal();
    this.props.onAddSeedShard(data);
  };

  componentDidMount() {
    const { onGetShardsChannel } = this.props;
    onGetShardsChannel();
  }

  toggleCancelOnDevice = () => {
    this.setState(state => ({ deny: !state.deny }));
  };

  render() {
    const {
      classes,
      onboarding,
      onToggleDeviceModal,
      history,
      onWipe,
      onAddMessage,
      t,
    } = this.props;
    if (!onboarding.provisionning.channel) {
      return <SpinnerCard />;
    }
    if (this.state.deny) {
      return (
        <ConfirmationCancel
          entity="Administrators"
          step="Master Seed generation"
          toggle={this.toggleCancelOnDevice}
          wipe={onWipe}
          title="Generate Master Seed"
        />
      );
    }
    return (
      <div>
        <Title>{t("onboarding:master_seed_provisionning.title")}</Title>
        <BlurDialog
          open={onboarding.device_modal}
          onClose={onToggleDeviceModal}
        >
          <GenerateSeedDevice
            shards_channel={onboarding.provisionning.channel}
            onFinish={this.finish}
            toggleCancelOnDevice={this.toggleCancelOnDevice}
            history={history}
            wraps={false}
            addMessage={onAddMessage}
            cancel={onToggleDeviceModal}
          />
        </BlurDialog>
        <Introduction>
          <Trans
            i18nKey="onboarding:master_seed_provisionning.description"
            components={<b>0</b>}
          />
        </Introduction>
        <div className={classes.steps}>
          {Array(3)
            .fill()
            .map((v, i) => (
              <FragmentKey
                key={i} // eslint-disable-line react/no-array-index-key
                disabled={onboarding.provisionning.blobs.length <= i - 1}
                label={t(`onboarding:master_seed_provisionning.step${i + 1}`)}
                labelGenerate={t(
                  "onboarding:master_seed_provisionning.generate_seed",
                )}
                generate={onToggleDeviceModal}
                generated={onboarding.provisionning.blobs.length > i}
              />
            ))}
        </div>
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
      </div>
    );
  }
}

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

export default connect(
  mapProps,
  mapDispatch,
)(withStyles(styles)(translate()(Provisioning)));
