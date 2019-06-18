/* eslint-disable react/prop-types */

import React, { PureComponent } from "react";
import Switch from "@material-ui/core/Switch";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FaAngleDoubleDown, FaAngleDoubleUp, FaCopy } from "react-icons/fa";
import { logout, login } from "redux/modules/auth";
import { connect } from "react-redux";

import colors from "shared/colors";
import Text from "components/base/Text";

const API_BASE_URL = "http://localhost:5001";

const styles = {
  root: {
    position: "fixed",
    bottom: 0,
    right: 0,
    display: "flex",
    flexDirection: "column",
    background: colors.night,
    color: colors.lead,
    // intended eheh :)
    zIndex: 99999999,
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
    width: 50,
    height: 70,
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
  autoLogout: {
    alignSelf: "center",
    marginLeft: 20,
  },
  collapseIcon: {
    cursor: "pointer",
    alignSelf: "center",
    padding: 10,
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
  10: "4f019f7e13795751",
  11: "294857902d9200c2",
  12: "51839a343537c54f",
  13: "f4e02d6e9000fdbe",
  16: "7201e8ecd398b1c9",
  17: "f1f4296963a685f6",
  18: "825696b3a0609531",
  19: "b5f489585f89ecda",
  20: "cb2bc36b417bbc5d",
  21: "ce5a8c3e772bc77f",
  22: "9bf0b2e0b22c4a45",
};

class MockDevices extends PureComponent {
  state = {
    deviceId: null,
    autoLogout: false,
    collapseMock: true,
    showOnboarding: false,
    forceHardware: false,
  };

  changeAutoLogout = () => {
    this.setState(state => ({ autoLogout: !state.autoLogout }));
  };

  async componentDidMount() {
    try {
      const result = await fetch(`${API_BASE_URL}/current-device`);
      const current = await result.json();
      const { device_id } = current;
      this.setState({
        deviceId: device_id,
      });
    } catch (e) {
      console.warn(e);
    }
  }

  switchDevice = async id => {
    try {
      await fetch(`${API_BASE_URL}/switch-device`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({ device_number: id }),
      });
      this.setState({ deviceId: id });
      if (this.state.autoLogout) {
        await this.props.logout();
      }
    } catch (e) {
      console.warn(e);
    }
  };

  collapseToggle = () => {
    this.setState(state => ({ collapseMock: !state.collapseMock }));
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
      autoLogout,
      collapseMock,
      showOnboarding,
      forceHardware,
    } = this.state;
    return (
      <div style={styles.root}>
        <div style={styles.actionContainer}>
          {!collapseMock && (
            <>
              <div style={styles.rowContainer}>
                <Text small uppercase style={styles.autoLogout}>
                  Auto logout ?
                </Text>
                <Switch
                  onChange={this.changeAutoLogout}
                  checked={autoLogout}
                  label="autologout"
                />
              </div>
              <div style={styles.rowContainer}>
                <Text small uppercase style={styles.autoLogout}>
                  Show wrapping / shared ?
                </Text>
                <Switch
                  onChange={this.onboardingToggle}
                  checked={showOnboarding}
                  label="show onboarding"
                />
              </div>
              <div style={styles.rowContainer}>
                <Text small uppercase style={styles.autoLogout}>
                  force hardware
                </Text>
                <Switch
                  onChange={this.forceHardwareToggle}
                  checked={forceHardware}
                  label="show onboarding"
                />
              </div>
            </>
          )}
          <div onClick={this.collapseToggle} style={styles.collapseIcon}>
            {collapseMock ? <FaAngleDoubleUp /> : <FaAngleDoubleDown />}
          </div>
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
    );
  }
}

function DeviceGroup({ name, children }) {
  return (
    <div style={styles.group}>
      <Text small uppercase>
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
export default connect(
  null,
  mapDispatchToProps,
)(MockDevices);
