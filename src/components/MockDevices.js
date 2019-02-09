/* eslint-disable react/prop-types */

import React, { PureComponent } from "react";
import Switch from "@material-ui/core/Switch";
import { FaAngleDoubleDown, FaAngleDoubleUp } from "react-icons/fa";
import Collapse from "@material-ui/core/Collapse";
import { logout } from "redux/modules/auth";
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
    color: colors.lead
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
  },
  rowContainer: {
    display: "flex",
    flexDirection: "row"
  },
  actionContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  autoLogout: {
    alignSelf: "center",
    marginLeft: 20
  },
  collapseIcon: {
    alignSelf: "center",
    marginRight: 10
  }
};

const devices = [
  ["Wrapping key", "orange", [1, 2, 3]],
  ["Admin", "green", [4, 5, 6]],
  ["Shared owner", "red", [7, 8, 9]]
];

class MockDevices extends PureComponent {
  state = {
    deviceId: null,
    autoLogout: false,
    collapseMock: false
  };

  changeAutoLogout = () => {
    this.setState(state => ({ autoLogout: !state.autoLogout }));
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
      if (this.state.autoLogout) {
        this.props.logout();
      }
    } catch (e) {
      console.warn(e);
    }
  };

  collapseToggle = () => {
    this.setState(state => ({ collapseMock: !state.collapseMock }));
  };

  render() {
    const { deviceId, autoLogout, collapseMock } = this.state;
    return (
      <div style={styles.root}>
        <div style={styles.actionContainer}>
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
          <div onClick={this.collapseToggle} style={styles.collapseIcon}>
            {collapseMock ? <FaAngleDoubleUp /> : <FaAngleDoubleDown />}
          </div>
        </div>
        <Collapse in={!collapseMock}>
          <div style={styles.rowContainer}>
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
        </Collapse>
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

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout())
});
export default connect(
  null,
  mapDispatchToProps
)(MockDevices);
