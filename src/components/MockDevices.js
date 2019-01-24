/* eslint-disable react/prop-types */

import React, { PureComponent } from "react";

import colors from "shared/colors";
import Text from "components/Text";

const API_BASE_URL = "http://localhost:5001";

const styles = {
  root: {
    position: "fixed",
    bottom: 0,
    right: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  container: {
    background: colors.night,
    color: colors.lead,
    borderTopLeftRadius: 3,
    padding: 3,
    display: "flex"
  },
  group: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  devices: {
    display: "flex"
  },
  device: {
    width: 50,
    height: 70,
    color: "white",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer"
  },
  circle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 30,
    height: 30,
    borderRadius: "50%",
    backgroundColor: "rgba(0, 0, 0, 0.2)"
  }
};

const devices = [
  ["Wrapping key", "orange", [1, 2, 3]],
  ["Admin", "green", [4, 5, 6]],
  ["Shared owner", "red", [7, 8, 9]]
];

class MockDevices extends PureComponent {
  state = {
    deviceId: null
  };

  async componentDidMount() {
    try {
      const result = await fetch(`${API_BASE_URL}/current-device`);
      const current = await result.json();
      const { device_id } = current;
      this.setState({ deviceId: device_id });
    } catch (e) {
      console.warn(e);
    }
  }

  switchDevice = async id => {
    try {
      await fetch(`${API_BASE_URL}/switch-device`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify({ device_number: id })
      });
      this.setState({ deviceId: id });
    } catch (e) {
      console.warn(e);
    }
  };

  render() {
    const { deviceId } = this.state;
    return (
      <div style={styles.root}>
        <div style={styles.container}>
          {devices.map(([g, color, devices]) => (
            <DeviceGroup name={g} key={g}>
              {devices.map(d => (
                <Device
                  key={d}
                  color={color}
                  id={d}
                  isActive={deviceId === d}
                  onClick={this.switchDevice}
                />
              ))}
            </DeviceGroup>
          ))}
        </div>
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

function Device({ id, color, isActive, onClick }) {
  return (
    <div
      onClick={() => onClick(id)}
      style={{
        ...styles.device,
        backgroundColor: color,
        opacity: isActive ? 5 : 0.5
      }}
    >
      {isActive ? (
        <div style={styles.circle}>
          <Text>{id}</Text>
        </div>
      ) : (
        <Text>{id}</Text>
      )}
    </div>
  );
}

export default MockDevices;
