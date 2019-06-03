// @flow
// TODO this file has been done in emergency, needs to be rewrite and refactor
import React, { Component } from "react";
import Home from "components/icons/Home";
import type { Translate } from "data/types";
import Trash from "components/icons/Trash";
import Update from "components/icons/Update";
import { withTranslation } from "react-i18next";
import Box from "components/base/Box";
import Text from "components/base/Text";
import Check from "components/icons/Check";
import CircleProgress from "@material-ui/core/CircularProgress";
import Button from "components/base/Button";
import qs from "qs";
import LedgerTransportU2F from "@ledgerhq/hw-transport-u2f";
import { createDeviceSocket } from "network/socket";
import createDevice, { U2F_TIMEOUT } from "device";

let _isMounted = false;

const Row = ({
  icon,
  children,
  state,
}: {
  icon: *,
  children: *,
  state: "None" | "Pending" | "Done",
}) => (
  <Box
    horizontal
    align="center"
    p={10}
    justify="space-between"
    style={{ background: "rgb(245, 245, 245)", borderRadius: 4 }}
  >
    <Box horizontal flow={10} align="center">
      <Box style={{ borderRadius: "50%", background: "white" }} p={10}>
        {icon}
      </Box>
      <Box>{children}</Box>
    </Box>
    <Box>
      <div>
        {state === "Done" && <Check size={22} />}
        {state === "Pending" && <CircleProgress size={22} color="primary" />}
      </div>
    </Box>
  </Box>
);

export const BASE_SOCKET_URL = "wss://api.ledgerwallet.com/update";

const appToInstall = {
  targetId: 0x31010004,
  perso: "perso_11",
  firmware: window.config.HSM_SIMU
    ? "blue/2.1.1-ee/vault3/app_latest_dev"
    : "blue/2.1.1-ee/vault3/app_latest",
  firmwareKey: window.config.HSM_SIMU
    ? "blue/2.1.1-ee/vault3/app_latest_dev_key"
    : "blue/2.1.1-ee/vault3/app_latest_key",
};
const appToUnInstall = {
  targetId: 0x31010004,
  perso: "perso_11",
  deleteKey: "blue/2.1.1-ee/vault3/app_del_key",
  firmware: "blue/2.1.1-ee/vault3/app_del",
  firmwareKey: "blue/2.1.1-ee/vault3/app_del_key",
};
type Props = {
  t: Translate,
};
type State = {
  uninstalled: boolean,
  error: boolean,
  installed: boolean,
  isDashboard: boolean,
};
class UpdateApp extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      uninstalled: false,
      error: false,
      installed: false,
      isDashboard: false,
    };
  }

  componentDidMount() {
    if (process.env.NODE_ENV === "e2e") {
      console.warn(
        "Not possible to update in software mode, run npm start instead of starte2e",
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
          appToUnInstall,
        )}`;
        await createDeviceSocket(transport, url).toPromise();
        this.setState({ uninstalled: true });
        const urlInstall = `${BASE_SOCKET_URL}/install?${qs.stringify(
          appToInstall,
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
            // error: true,
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
    const { t } = this.props;
    const { isDashboard, error, uninstalled, installed } = this.state;

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

    if (error) {
      return (
        <Box align="flex-end" p={30} flow={10}>
          <Text i18nKey="update:error" />
          <Button onClick={this.start} customColor="green" variant="text">
            {t("update:retry")}
          </Button>
        </Box>
      );
    }
    return (
      <Box p={30} flow={20}>
        <p>{t("update:sub_title")}</p>
        <Box flow={10}>
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
        </Box>
      </Box>
    );
  }
}

export default withTranslation()(UpdateApp);
