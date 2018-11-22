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
import SupportLink from "components/SupportLink";
import BlueError from "components/icons/BlueError";
import Copy from "components/icons/Copy";
import Recover from "components/icons/Recover";
import Warning from "components/icons/TriangleWarning";
import type { Account } from "data/types";
import type { Translate } from "data/types";
import { translate, Interpolate } from "react-i18next";
import QRCode from "components/QRCode";
import ModalSubTitle from "components/operations/creation/ModalSubTitle";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  base: {
    "& p": {
      fontSize: 13
    }
  },
  error: {
    padding: "0 40px",
    paddingTop: 0,
    fontSize: 15,
    marginTop: 23,
    textAlign: "center"
  },
  error_desc: {
    margin: "20px 0 20px 0",
    "& p": {
      textAlign: "left"
    }
  },
  support: {
    textTransform: "uppercase",
    fontSize: 11,
    color: "grey"
  },
  error_title: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    textTransform: "uppercase",
    fontWeight: "bold",
    width: 220,
    fontSize: 13,
    margin: "auto"
  },
  address: {
    paddingLeft: 40,
    textAlign: "center",
    paddingRight: 40
  },
  hash: {
    border: "1px dashed grey",
    lineHeight: "25px",
    textAlign: "center",
    width: "100%",
    outline: "none",
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 9
  },
  actions: {
    marginTop: 27,
    display: "flex",
    justifyContent: "space-around"
  },
  icon: {
    cursor: "pointer",
    opacity: 0.5,
    transition: "opacity 200ms ease",
    display: "flex",
    alignItems: "center",
    "&:hover": {
      opacity: 1
    }
  },
  verified: {
    fontSize: 13
  },
  account: {
    fontSize: 13
  }
};

type Props = {
  t: Translate,
  account: Account,
  checkAgain: void => void,
  classes: { [_: $Keys<typeof styles>]: string }
};
type State = {
  error: boolean,
  verified: boolean,
  loading: boolean,
  error: boolean
};
class ReceiveAddress extends Component<Props, State> {
  input: ?HTMLInputElement = null;

  state = {
    error: false,
    loading: false,
    verified: false
  };
  componentDidMount() {
    this.verifyAddress();
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
        `/accounts/${account.id}/address?derivation_path=${account
          .fresh_addresses[0].derivation_path}`,
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
      console.error(error);
      if (error.statusCode && error.statusCode === 27013) {
        this.setState({ error: true });
      }
      if (error.statusCode && error.statusCode === U2F_TIMEOUT) {
        this.verifyAddress();
      }
    }
  };

  copy = () => {
    //@$FlowFixMe
    this.input.select();
    document.execCommand("copy");
  };
  selection = () => {
    if (this.state.verified) {
      return () => {};
    }
    return e => e.preventDefault();
  };
  render() {
    const { t, account, classes, checkAgain } = this.props;
    const { error, verified, loading } = this.state;
    return (
      <div className={classes.base}>
        <ModalSubTitle>{t("receive:receive_subtitle")}</ModalSubTitle>
        {loading && <SpinnerCard />}
        {!error &&
          !loading && (
            <div className={classes.address}>
              <QRCode
                hash={`${account.currency.payment_uri_scheme}:${account
                  .fresh_addresses[0]}`}
                size={140}
              />
              <div className={classes.account}>
                <Interpolate
                  i18nKey="receive:receive_account"
                  name={account.name}
                />
              </div>
              <input
                type="text"
                className={classes.hash}
                ref={element => (this.input = element)}
                value={account.fresh_addresses[0].address}
                onChange={() => false}
                onMouseDown={this.selection()}
              />
              {!verified && <p>{t("receive:verify_on_device")}</p>}
              {verified && (
                <div>
                  <div className={classes.verified}>
                    <Interpolate
                      i18nKey="receive:confirmed_device"
                      name={account.name}
                    />
                  </div>
                  <div className={classes.actions}>
                    <div className={classes.icon} onClick={checkAgain}>
                      <Recover size={22} />
                      <span style={{ marginLeft: 10 }}>
                        {t("receive:re_verify")}
                      </span>
                    </div>
                    <div className={classes.icon} onClick={this.copy}>
                      <Copy size={22} />
                      <span style={{ marginLeft: 10 }}>
                        {t("receive:copy")}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        {error && (
          <div className={classes.error}>
            <div className={classes.error_title}>
              <div style={{ color: "red", marginRight: 5 }}>
                <Warning width={20} height={20} />
              </div>
              <span>{t("receive:address_rejected")}</span>
            </div>
            <div className={classes.error_desc}>
              <p>{t("receive:address_rejected1")}</p>
              <p>{t("receive:address_rejected2")}</p>
              <div style={{ marginTop: 40 }}>
                <BlueError size={50} />
              </div>
            </div>
            <div className={classes.actions}>
              <div className={classes.icon} onClick={checkAgain}>
                <Recover size={22} />
                <span
                  style={{
                    marginLeft: 10,
                    textTransform: "uppercase",
                    fontSize: 11
                  }}
                >
                  {t("receive:retry")}
                </span>
              </div>
              <SupportLink
                className={classes.support}
                label={t("receive:support")}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}
export default withStyles(styles)(translate()(ReceiveAddress));
