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
import network from "network";
export type DeviceInfo = {
  targetId: string | number,
  seVersion: string,
  isBootloader: boolean,
  flags: string,
  mcuVersion: string,
  isOSU: boolean,
  providerName: string,
  providerId: number,
  fullVersion: string
};
type Input = {
  fullVersion: string,
  deviceId: string | number,
  provider: number
};

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
const PROVIDER = 5;
const urlBuilder = (base: string) => (endpoint: string): string =>
  `${base}/${endpoint}`;
const MANAGER_API_BASE = "https://manager.api.live.ledger.com/api";
const managerUrlbuilder = urlBuilder(MANAGER_API_BASE);
export const BASE_SOCKET_URL = "wss://api.ledgerwallet.com/update";

export const GET_DEVICE_VERSION: string = managerUrlbuilder(
  "get_device_version"
);
export const APPLICATIONS_BY_DEVICE: string = managerUrlbuilder("get_apps");
export const GET_APPLICATIONS: string = managerUrlbuilder("applications");
export const GET_CURRENT_FIRMWARE: string = managerUrlbuilder(
  "get_firmware_version"
);

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
        const deviceInfo = await this.getDeviceInfo();
        const deviceData = await this.getDeviceVersion(
          deviceInfo.targetId,
          deviceInfo.providerId
        );
        const firmwareData = await this.getCurrentFirmware({
          deviceId: deviceData.id,
          fullVersion: deviceInfo.fullVersion,
          provider: deviceInfo.providerId
        });
        const params = {
          provider: deviceInfo.providerId,
          current_se_firmware_final_version: firmwareData.id,
          device_version: deviceData.id
        };

        const { application_versions } = await network(
          APPLICATIONS_BY_DEVICE,
          "POST",
          params,
          true
        );

        if (application_versions.length > 0) {
          //FIXME we take the first here, assuming only one app is available for blue EE. may be not ?
          const app = application_versions[0];
          const appToInstall = {
            targetId: deviceInfo.targetId,
            perso: app.perso,
            deleteKey: app.delete_key,
            firmware: app.firmware,
            firmwareKey: app.firmware_key,
            hash: app.hash
          };

          const appToUnInstall = {
            targetId: deviceInfo.targetId,
            perso: app.perso,
            deleteKey: app.delete_key,
            firmware: app.delete,
            firmwareKey: app.delete_key,
            hash: app.hash
          };

          const transport = await LedgerTransportU2F.create(90000000, 90000000);
          transport.setScrambleKey("B0L0S");
          const url = `${BASE_SOCKET_URL}/install?${qs.stringify(
            appToUnInstall
          )}`;
          await createDeviceSocket(transport, url).toPromise();
          this.setState({ uninstalled: true });
          const urlInstall = `${BASE_SOCKET_URL}/install?${qs.stringify(
            appToInstall
          )}`;
          await createDeviceSocket(transport, urlInstall).toPromise();
          this.setState({ installed: true });
        } else {
          this.setState({ no_application: true });
        }
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

  getDeviceVersion = async (
    targetId: string | number,
    provider: number
  ): Promise<*> => {
    const body = {
      provider,
      target_id: targetId
    };
    const data = await network(GET_DEVICE_VERSION, "POST", body, true);
    return data;
  };
  getCurrentFirmware = async (input: Input): Promise<*> => {
    const body = {
      device_version: input.deviceId,
      version_name: input.fullVersion,
      provider: input.provider
    };
    const data = await network(GET_CURRENT_FIRMWARE, "POST", body, true);
    return data;
  };
  getDeviceInfo = async (): Promise<DeviceInfo> => {
    const device = await createDevice("B0L0S");
    const res = await device.getFirmwareInfo();
    const { seVersion } = res;
    const { targetId, mcuVersion, flags } = res;
    const parsedVersion =
      seVersion.match(/([0-9]+.[0-9])+(.[0-9]+)?((?!-osu)-([a-z]+))?(-osu)?/) ||
      [];
    const isOSU = typeof parsedVersion[5] !== "undefined";
    const providerName = parsedVersion[4] || "";
    const providerId = PROVIDER;
    const isBootloader = targetId === 0x01000001;
    const majMin = parsedVersion[1];
    const patch = parsedVersion[2] || ".0";
    const fullVersion = `${majMin}${patch}${providerName
      ? `-${providerName}`
      : ""}`;
    const data = {
      targetId,
      seVersion: majMin + patch,
      isOSU,
      mcuVersion,
      isBootloader,
      providerName,
      providerId,
      flags,
      fullVersion
    };
    this.setState({ isDashboard: true });
    return data;
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
