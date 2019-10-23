/* eslint-disable react/prop-types */

import React, { PureComponent } from "react";
import { createPortal } from "react-dom";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FaAngleDoubleDown, FaAngleDoubleUp, FaCopy } from "react-icons/fa";
import { logout, login } from "redux/modules/auth";
import { connect } from "react-redux";

import colors from "shared/colors";
import Text from "components/base/Text";
import { Switch } from "components/base/form";

const DEVICE_API_URL = "http://localhost:5001";

const devtoolsContainer = document.createElement("div");
devtoolsContainer.classList.add("devtools-container");
const devtoolsRoot =
  document.body && document.body.appendChild(devtoolsContainer);

const styles = {
  root: {
    position: "fixed",
    bottom: 0,
    right: 10,
    display: "flex",
    alignItems: "flex-end",
    whiteSpace: "nowrap",
    // intended eheh :)
    zIndex: 99999999,
  },
  wrapper: {
    marginRight: 5,
    display: "flex",
    flexDirection: "column",
    background: colors.night,
    color: colors.lead,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  group: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  devices: {
    display: "flex",
  },
  device: {
    width: 58,
    height: 74,
    color: "white",
    fontWeight: "bold",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  circle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 30,
    height: 30,
    borderRadius: "50%",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  rowContainer: {
    display: "flex",
    flexDirection: "row",
  },
  actionContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  autoLogin: {
    alignSelf: "center",
    marginLeft: 20,
  },
  triggerIcon: {
    cursor: "pointer",
    padding: 10,
    display: "flex",
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  switchContainer: {
    margin: 8,
  },
};

const devices = [
  ["Wrapping key", "orange", [1, 2, 3]],
  ["Admin", "green", [4, 5, 6]],
  ["Shared owner", "red", [7, 8, 9]],
  ["Operators", "blue", [10, 11, 12, 13, 16, 17, 18, 19, 20, 21, 22]],
];

const onboardingDevices = ["Wrapping key", "Shared owner"];

const deviceIds = {
  4: "3e5d93bd3d1bb422",
  5: "7c745c871a759648",
  6: "776a93ed2a94b12d",
  10: "84e5ca3641ab0d8f",
  11: "2d6b4c922d0816a8",
  12: "a1887741b3079235",
  13: "ee28c05e09d91079",
  14: "96f3b9d890e84b3e",
  15: "3e5d93bd3d1bb422",
  16: "7996a597c0dc62a0",
  17: "ee19fed05c6d809d",
  18: "cf3f26692e3bfb46",
  19: "20c0a5fc173935e7",
  20: "8db6447808dc4121",
  21: "85a6f315cdb1efc7",
  22: "6fdc95cfdc89ce6a",
};

class MockDevices extends PureComponent {
  state = {
    deviceId: null,
    autoLogin: false,
    collapseMock: true,
    rejectNextAction: false,
    showOnboarding: false,
    forceHardware: false,
  };

  changeAutoLogin = () => {
    this.setState(state => ({ autoLogin: !state.autoLogin }));
  };

  async componentDidMount() {
    try {
      const resultCurrent = await fetch(`${DEVICE_API_URL}/current-device`);
      const current = await resultCurrent.json();
      const resultStore = await fetch(`${DEVICE_API_URL}/meta/store`);
      const store = await resultStore.json();
      const { device_id } = current;
      this.setState({
        deviceId: device_id,
        rejectNextAction: store.approvals.User !== true,
      });
    } catch (e) {
      console.warn(e);
    }
  }

  updateNextApproval(entity, checked) {
    return fetch(`${DEVICE_API_URL}/meta/store`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        approvals: {
          [entity]: checked,
        },
      }),
    });
  }

  switchDevice = async id => {
    try {
      await fetch(`${DEVICE_API_URL}/switch-device`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({ device_number: id }),
      });
      this.setState({ deviceId: id });
      if (this.state.autoLogin) {
        await this.props.logout({ autoLogin: true });
      }
    } catch (e) {
      console.warn(e);
    }
  };

  collapseToggle = () => {
    this.setState(state => ({ collapseMock: !state.collapseMock }));
  };

  rejectNextActionToggle = async () => {
    await Promise.all(
      [
        "AccountAddress",
        "OperatorGroup",
        "Partition",
        "Account",
        "Transaction",
        "User",
      ].map(entity =>
        this.updateNextApproval(entity, this.state.rejectNextAction),
      ),
    );

    this.setState(state => ({ rejectNextAction: !state.rejectNextAction }));
  };

  onboardingToggle = () => {
    this.setState(state => ({ showOnboarding: !state.showOnboarding }));
  };

  forceHardwareToggle = () => {
    window.FORCE_HARDWARE = !window.FORCE_HARDWARE;
    this.setState(() => ({ forceHardware: window.FORCE_HARDWARE }));
  };

  render() {
    const {
      deviceId,
      autoLogin,
      collapseMock,
      showOnboarding,
      rejectNextAction,
      forceHardware,
    } = this.state;
    const devtools = (
      <div style={styles.root}>
        <div style={styles.wrapper}>
          <div style={styles.actionContainer}>
            <div onClick={this.collapseToggle} style={styles.triggerIcon}>
              {collapseMock ? <FaAngleDoubleUp /> : <FaAngleDoubleDown />}
            </div>
            {!collapseMock && (
              <>
                <div style={styles.rowContainer}>
                  <Text size="small" uppercase style={styles.autoLogin}>
                    Auto login?
                  </Text>
                  <div style={styles.switchContainer}>
                    <Switch onChange={this.changeAutoLogin} value={autoLogin} />
                  </div>
                </div>
                <div style={styles.rowContainer}>
                  <Text size="small" uppercase style={styles.autoLogin}>
                    Show wrapping / shared ?
                  </Text>
                  <div style={styles.switchContainer}>
                    <Switch
                      onChange={this.onboardingToggle}
                      value={showOnboarding}
                    />
                  </div>
                </div>
                <div style={styles.rowContainer}>
                  <Text size="small" uppercase style={styles.autoLogin}>
                    Reject next action
                  </Text>
                  <div style={styles.switchContainer}>
                    <Switch
                      onChange={this.rejectNextActionToggle}
                      value={rejectNextAction}
                    />
                  </div>
                </div>
                <div style={styles.rowContainer}>
                  <Text size="small" uppercase style={styles.autoLogin}>
                    force hardware
                  </Text>
                  <div style={styles.switchContainer}>
                    <Switch
                      onChange={this.forceHardwareToggle}
                      value={forceHardware}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
          {!collapseMock && (
            <div style={styles.rowContainer}>
              {devices
                .filter(([g]) =>
                  showOnboarding ? true : !onboardingDevices.includes(g),
                )
                .map(([g, color, devices]) => (
                  <DeviceGroup name={g} key={g}>
                    {devices.map(d => (
                      <Device
                        key={d}
                        color={color}
                        id={d}
                        deviceId={deviceIds[d] || null}
                        isActive={deviceId === d}
                        onClick={this.switchDevice}
                      />
                    ))}
                  </DeviceGroup>
                ))}
            </div>
          )}
        </div>
      </div>
    );
    return createPortal(devtools, devtoolsRoot);
  }
}

function DeviceGroup({ name, children }) {
  return (
    <div style={styles.group}>
      <Text size="small" uppercase>
        {name}
      </Text>
      <div style={styles.devices}>{children}</div>
    </div>
  );
}

function Device({ id, color, isActive, onClick, deviceId }) {
  return (
    <div
      onClick={() => onClick(id)}
      style={{
        ...styles.device,
        backgroundColor: color,
        opacity: isActive ? 5 : 0.5,
      }}
    >
      {isActive ? (
        <div style={styles.circle}>
          <Text>{id}</Text>
        </div>
      ) : (
        <Text>{id}</Text>
      )}
      {deviceId && (
        <div onClick={stopPropagate} style={{ marginTop: 10 }}>
          <CopyToClipboard text={deviceId}>
            <FaCopy />
          </CopyToClipboard>
        </div>
      )}
    </div>
  );
}

const stopPropagate = e => {
  e.stopPropagation();
  e.preventDefault();
};

const mapDispatchToProps = {
  logout,
  login,
};
export default connect(null, mapDispatchToProps)(MockDevices);
