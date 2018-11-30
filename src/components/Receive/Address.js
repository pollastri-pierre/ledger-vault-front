//@flow
import React, { Component } from "react";
import SpinnerCard from "components/spinners/SpinnerCard";
import network from "network";
import createDevice, {
  CONFIDENTIALITY_PATH,
  U2F_TIMEOUT,
  VALIDATION_PATH,
  MATCHER_SESSION
} from "device";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { withStyles } from "@material-ui/core/styles";
import Copy from "components/icons/Copy";
import Recover from "components/icons/Recover";
import type { Account } from "data/types";
import { Interpolate, Trans } from "react-i18next";
import QRCode from "components/QRCode";
import colors from "shared/colors";
import ReceiveLayout from "./ReceiveLayout";
import AddressError from "./AddressError";
import ShieldBox from "./ShieldBox";

type Props = {
  account: Account,
  checkAgain: void => void,
  classes: { [_: $Keys<typeof styles>]: string }
};
type State = {
  error: boolean,
  verified: boolean,
  loading: boolean,
  error: boolean,
  copied: boolean
};
class ReceiveAddress extends Component<Props, State> {
  input: ?HTMLInputElement = null;

  state = {
    error: false,
    loading: false,
    verified: false,
    copied: false
  };
  componentDidMount() {
    this.verifyAddress();
  }
  componentWillUnmount() {
    if (this._timeout) clearTimeout(this._timeout);
  }
  verifyAddress = async () => {
    try {
      const device = await createDevice();
      const { account } = this.props;
      this.setState({ loading: true });
      const {
        attestation_certificate,
        ephemeral_public_key,
        wallet_address
      } = await network(
        `/accounts/${account.id}/address?derivation_path=${
          account.fresh_addresses[0].derivation_path
        }`,
        "GET"
      );
      this.setState({ loading: false });

      await device.openSession(
        CONFIDENTIALITY_PATH,
        Buffer.from(ephemeral_public_key, "hex"),
        Buffer.from(attestation_certificate, "base64"),
        MATCHER_SESSION
      );
      await device.validateVaultOperation(
        VALIDATION_PATH,
        Buffer.from(wallet_address, "base64")
      );
      this.setState({ verified: true, error: false });
    } catch (error) {
      if (error.statusCode && error.statusCode === 27013) {
        this.setState({ error: true });
      }
      if (error.statusCode && error.statusCode === U2F_TIMEOUT) {
        this.verifyAddress();
      }
    }
  };

  onCopy = () => {
    this.setState({ copied: true });
    this._timeout = setTimeout(() => this.setState({ copied: false }), 1e3);
  };

  _timeout: ?TimeoutID = null;

  render() {
    const { account, classes, checkAgain } = this.props;
    const { error, verified, loading, copied } = this.state;
    return (
      <div className={classes.container}>
        {loading && <SpinnerCard />}
        {!error &&
          !loading && (
            <ReceiveLayout
              header={null}
              content={
                <div className={classes.address}>
                  <QRCode
                    hash={`${account.currency.payment_uri_scheme}:${
                      account.fresh_addresses[0]
                    }`}
                    size={140}
                  />
                  <div className={classes.account}>
                    <Trans i18nKey="receive:receive_account">
                      {"Address for account"}
                      <strong>{account.name}</strong>
                    </Trans>
                  </div>
                  <div className={classes.hash}>
                    {copied ? (
                      <span><Trans i18nKey="receive:address_copied" /></span>
                    ) : (
                      <span>{account.fresh_addresses[0].address}</span>
                    )}
                  </div>
                  {verified ? (
                    <div>
                      <ShieldBox
                        iconColor={colors.green}
                        text={
                          <Interpolate
                            i18nKey="receive:confirmed_device"
                            name={account.name}
                          />
                        }
                      />
                    </div>
                  ) : (
                    <ShieldBox
                      iconColor={colors.ocean}
                      text={<Trans i18nKey="receive:verify_on_device" />}
                    />
                  )}
                </div>
              }
              footer={
                verified ? (
                  <div className={classes.actions}>
                    <div className={classes.icon} onClick={checkAgain}>
                      <Recover size={16} color={colors.shark} />
                      <span className={classes.actionText}>
                        <Trans i18nKey="receive:re_verify" />
                      </span>
                    </div>
                    <CopyToClipboard
                      text={account.fresh_addresses[0].address}
                      onCopy={this.onCopy}
                    >
                      <div className={classes.icon}>
                        <Copy color={colors.shark} size={16} />
                        <span className={classes.actionText}>
                          <Trans i18nKey="receive:copy" />
                        </span>
                      </div>
                    </CopyToClipboard>
                  </div>
                ) : null
              }
            />
          )}
        {error && <AddressError checkAgain={checkAgain} />}
      </div>
    );
  }
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh"
  },
  address: {
    paddingLeft: 40,
    textAlign: "center",
    paddingRight: 40
  },
  hash: {
    border: "1px dashed #d8d8d8",
    padding: 10,
    backgroundColor: colors.cream,
    outline: "none",
    marginTop: 25,
    marginBottom: 20,
    borderRadius: 4,
    fontSize: 13
  },
  actions: {
    marginTop: 27,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around"
  },
  icon: {
    cursor: "pointer",
    opacity: 0.5,
    transition: "opacity 200ms ease",
    alignItems: "center",
    "&:hover": {
      opacity: 1
    },
    display: "flex",
    flexDirection: "column"
  },
  account: {
    fontSize: 12,
    color: colors.shark,
    marginTop: 15
  },
  actionText: {
    marginLeft: 10,
    fontSize: 12
  },
  not_verified: {
    fontSize: 12,
    color: colors.shark
  }
};

export default withStyles(styles)(ReceiveAddress);
