//@flow
//TODO
// this file has been done in emergency, needs to be rewrite and refactor
import React, { Component } from "react";
import Home from "components/icons/Home";
import type { Translate } from "data/types";
import Trash from "components/icons/Trash";
import Update from "components/icons/Update";
import { translate } from "react-i18next";
import { U2F_TIMEOUT } from "device";
import Check from "components/icons/Check";
import CircleProgress from "@material-ui/core/CircularProgress";
import { withStyles } from "@material-ui/core/styles";
import Card from "components/Card";
import qs from "qs";
import LedgerTransportU2F from "@ledgerhq/hw-transport-u2f";
import { createDeviceSocket } from "network/socket";
import createDevice from "device";

let _isMounted = false;
const styles = {
  base: {
    width: 550,
    margin: "auto",
    marginTop: 125
  },
  error: {},
  button: {
    background: "green",
    display: "block",
    width: 120,
    margin: "auto",
    marginTop: 20,
    height: 40,
    border: 0,
    fontSize: 19,
    color: "white"
  }
};

const row = {
  base: {
    background: "#f7f6f6",
    position: "relative",
    marginBottom: 5,
    height: 75,
    fontSize: 14,
    display: "flex",
    alignItems: "center"
  },
  icon: {
    border: "1px solid",
    marginRight: 20,
    marginLeft: 15,
    width: 30,
    height: 30,
    borderRadius: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  right: {
    position: "absolute",
    right: 20
  }
};
const Row = withStyles(
  row
)(
  ({
    icon,
    children,
    classes,
    state
  }: {
    icon: *,
    children: *,
    classes: { [_: $Keys<typeof row>]: string },
    state: "None" | "Pending" | "Done"
  }) => {
    return (
      <div className={classes.base}>
        <div className={classes.icon}>{icon}</div>
        <div>{children}</div>
        <div className={classes.right} style={{ color: "#27d0e2" }}>
          {state === "Done" && <Check size={22} />}
          {state === "Pending" && <CircleProgress size={22} color="primary" />}
        </div>
      </div>
    );
  }
);
export const BASE_SOCKET_URL = "wss://api.ledgerwallet.com/update";

const appToInstall = {
  targetId: 0x31010004,
  perso: "perso_11",
  firmware:
    process.env.NODE_ENV === "development"
      ? "blue/2.1.1-ee/vault3/app_latest_dev"
      : "blue/2.1.1-ee/vault3/app_latest",
  firmwareKey:
    process.env.NODE_ENV === "development"
      ? "blue/2.1.1-ee/vault3/app_latest_dev_key"
      : "blue/2.1.1-ee/vault3/app_latest_key"
};
const appToUnInstall = {
  targetId: 0x31010004,
  perso: "perso_11",
  deleteKey: "blue/2.1.1-ee/vault3/app_del_key",
  firmware: "blue/2.1.1-ee/vault3/app_del",
  firmwareKey: "blue/2.1.1-ee/vault3/app_del_key"
};
type Props = {
  classes: { [_: $Keys<typeof styles>]: string },
  t: Translate
};
type State = {
  applications: ?Object,
  uninstalled: boolean,
  no_application: boolean,
  error: boolean,
  installed: boolean,
  isDashboard: boolean
};
class UpdateApp extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      applications: null,
      uninstalled: false,
      error: false,
      installed: false,
      no_application: false,
      isDashboard: false
    };
  }
  componentDidMount() {
    if (process.env.NODE_ENV === "e2e") {
      console.warn(
        "Not possible to update in software mode, run npm start instead of starte2e"
      );
    }
    _isMounted = true;
    this.start();
  }
  componentWillUnmount() {
    _isMounted = false;
  }
  start = async () => {
    if (_isMounted) {
      try {
        this.setState({ error: false });
        await this.getDeviceInfo();
        const transport = await LedgerTransportU2F.create(90000000, 90000000);
        transport.setScrambleKey("B0L0S");
        const url = `${BASE_SOCKET_URL}/install?${qs.stringify(
          appToUnInstall
        )}`;
        console.log(appToInstall);
        await createDeviceSocket(transport, url).toPromise();
        this.setState({ uninstalled: true });
        const urlInstall = `${BASE_SOCKET_URL}/install?${qs.stringify(
          appToInstall
        )}`;
        await createDeviceSocket(transport, urlInstall).toPromise();
        this.setState({ installed: true });
      } catch (e) {
        console.error(e);
        if (e && e.id && e.id === U2F_TIMEOUT) {
          this.start();
        } else {
          this.setState({
            isDashboard: false,
            uninstalled: false,
            installed: false,
            error: true
          });
        }
      }
    }
  };

  // we don't care about the result, just want to be sure we are on the dashboard
  getDeviceInfo = async (): Promise<boolean> => {
    const device = await createDevice("B0L0S");
    await device.getFirmwareInfo();
    this.setState({ isDashboard: true });
    return true;
  };

  render() {
    const { classes, t } = this.props;
    const {
      isDashboard,
      error,
      uninstalled,
      no_application,
      installed
    } = this.state;

    let stateUninstall = "None";
    let stateInstall = "None";

    if (isDashboard && !uninstalled) {
      stateUninstall = "Pending";
    } else if (isDashboard && uninstalled) {
      stateUninstall = "Done";
    }

    if (uninstalled && !installed) {
      stateInstall = "Pending";
    } else if (uninstalled && installed) {
      stateInstall = "Done";
    }

    if (no_application) {
      return (
        <div className={classes.base}>
          <Card title={t("update:title")}>
            <div className={classes.error}>
              {t("update:no_version")}
              <button onClick={this.start} className={classes.button}>
                {t("update:retry")}
              </button>
            </div>
          </Card>
        </div>
      );
    }
    if (error) {
      return (
        <div className={classes.base}>
          <Card title={t("update:title")}>
            <div className={classes.error}>
              {t("update:error")}
              <button onClick={this.start} className={classes.button}>
                {t("update:retry")}
              </button>
            </div>
          </Card>
        </div>
      );
    }
    return (
      <div className={classes.base}>
        <Card title={t("update:title")}>
          <p>{t("update:sub_title")}</p>
          <br />
          <Row
            icon={<Home size={19} />}
            state={!isDashboard ? "Pending" : "Done"}
          >
            {t("update:connect")}
          </Row>
          <Row icon={<Trash size={19} />} state={stateUninstall}>
            {t("update:uninstall")}
          </Row>
          <Row icon={<Update size={19} />} state={stateInstall}>
            {t("update:install")}
          </Row>
        </Card>
      </div>
    );
  }
}

export default withStyles(styles)(translate()(UpdateApp));
