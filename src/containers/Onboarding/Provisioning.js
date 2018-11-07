//@flow
import BlurDialog from "components/BlurDialog";
import ConfirmationCancel from "containers/Onboarding/ConfirmationCancel";
import SpinnerCard from "components/spinners/SpinnerCard";
import type { Translate } from "data/types";
import FragmentKey from "containers/Onboarding/Fragment";
import { translate } from "react-i18next";
import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import GenerateKeyFragments from "./GenerateKeyFragments";
import { Title, Introduction } from "components/Onboarding";
import DialogButton from "components/buttons/DialogButton";
import Footer from "./Footer";
import {
  toggleDeviceModal,
  addMasterSeedKey,
  wipe,
  openProvisionningChannel
} from "redux/modules/onboarding";
import { addMessage } from "redux/modules/alerts";

const styles = {
  steps: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 35
  },
  title: {
    fontSize: 12,
    fontWeight: 600,
    margin: "0 0 12px 0"
  },
  step: {
    paddingRight: 13,
    paddingLeft: 25,
    "&:first-child": {
      paddingLeft: 0
    },
    transition: "all 200ms ease"
  },
  disabled: {
    opacity: 0.2
  },
  separator: {
    width: 1,
    height: 94,
    background: "#eeeeee"
  }
};
type Props = {
  classes: { [$Keys<typeof styles>]: string },
  t: Translate,
  onboarding: *,
  onToggleDeviceModal: Function,
  onGetShardsChannel: Function,
  onWipe: Function,
  history: *,
  onProvisioningShards: Function,
  onAddMessage: (string, string, string) => void,
  onAddSeedShard: Function
};
type State = {
  deny: boolean
};
class Provisioning extends Component<Props, State> {
  state = {
    deny: false
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
    this.setState({ deny: !this.state.deny });
  };

  render() {
    const {
      classes,
      onboarding,
      onToggleDeviceModal,
      history,
      onWipe,
      onAddMessage,
      t
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
          <GenerateKeyFragments
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
          {t("onboarding:master_seed_provisionning.description")}
        </Introduction>
        <div className={classes.steps}>
          {Array(3)
            .fill()
            .map((v, i) => (
              <FragmentKey
                key={i}
                disabled={onboarding.provisionning.blobs.length <= i - 1}
                label={t(`onboarding:master_seed_provisionning.step${i + 1}`)}
                labelGenerate={t(
                  "onboarding:master_seed_provisionning.generate_seed"
                )}
                generate={onToggleDeviceModal}
                generated={onboarding.provisionning.blobs.length > i}
              />
            ))}
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
                disabled={onboarding.provisionning.blobs.length < 3}
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

const mapProps = state => ({
  onboarding: state.onboarding
});

const mapDispatch = (dispatch: *) => ({
  onToggleDeviceModal: () => dispatch(toggleDeviceModal()),
  onAddSeedShard: data => dispatch(addMasterSeedKey(data)),
  onAddMessage: (title, msg, type) => dispatch(addMessage(title, msg, type)),
  onWipe: () => dispatch(wipe()),
  onGetShardsChannel: () => dispatch(openProvisionningChannel())
});

export default connect(mapProps, mapDispatch)(
  withStyles(styles)(translate()(Provisioning))
);
