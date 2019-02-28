// @flow
import React, { PureComponent } from "react";
import Box from "components/base/Box";
import styled from "styled-components";
import colors from "shared/colors";
import { MdComputer, MdTouchApp, MdError } from "react-icons/md";
import CircularProgress from "@material-ui/core/CircularProgress";
import { FaMobileAlt, FaServer } from "react-icons/fa";

export type CurrentActionType = "device" | "server";

type Props = {
  numberSteps: number,
  currentStep: ?number,
  needsUserInput?: boolean,
  error?: boolean,
  currentActionType: CurrentActionType
};

const computerIcon = <MdComputer size={20} />;
const touchRequiredIcon = <MdTouchApp size={20} />;
const serverIcon = <FaServer size={20} />;
const blueIcon = <FaMobileAlt size={20} />;
const loader = <CircularProgress size={15} />;
const errorIcon = <MdError size={15} color={colors.grenade} />;

const Container = styled(Box).attrs({
  p: 20,
  horizontal: true,
  align: "center"
})`
  border-radius: 5px;
  opacity: ${p => (p.error ? "0.5" : "1")};
  background: ${colors.pearl};
`;

const DeviceIcon = ({ needsUserInput }: { needsUserInput: ?boolean }) => (
  <Box position="relative">
    {blueIcon}
    {needsUserInput && (
      <Box position="absolute" style={{ bottom: -8, right: -2 }}>
        {touchRequiredIcon}
      </Box>
    )}
  </Box>
);

const Dash = styled(Box)`
  width: 10px;
  height: 2px;
  background: ${p => (p.done ? colors.green : "black")};
  opacity: ${p => (p.done || p.active ? 1 : 0.1)};
`;

type PropsDash = {
  number: number,
  currentStep: ?number,
  error: ?boolean
};

type StateDash = {
  intervalId: ?IntervalID,
  deviceReady: ?boolean,
  dashActive: number
};
class DashContainer extends PureComponent<PropsDash, StateDash> {
  state = {
    intervalId: null,
    deviceReady: false,
    dashActive: 0
  };

  static defaultProps = {
    number: 3
  };

  componentDidMount() {
    const intervalId = setInterval(() => this.update(), 200);
    this.setState({ intervalId });
  }

  static getDerivedStateFromProps(props, state) {
    const { currentStep } = props;
    return {
      ...state,
      deviceReady: currentStep > 0
    };
  }

  componentDidUpdate() {
    const { intervalId, deviceReady } = this.state;
    const { error } = this.props;
    if ((deviceReady || error) && intervalId) {
      clearInterval(intervalId);
    }
  }

  componentWillUnmount() {
    const { intervalId } = this.state;
    if (intervalId) {
      clearInterval(intervalId);
    }
  }

  update() {
    const { number } = this.props;
    const { dashActive } = this.state;
    const newActive = dashActive === number + 1 ? 0 : dashActive + 1;
    this.setState({
      dashActive: newActive
    });
  }

  renderDashes = () => {
    const { number, currentStep } = this.props;
    const { dashActive } = this.state;

    const rows = [];
    for (let i = 0; i < number; i++) {
      rows.push(
        <Dash
          active={dashActive === i}
          done={currentStep && i < currentStep}
          key={i}
        />
      );
    }
    return rows;
  };

  render() {
    const { deviceReady } = this.state;
    const { error } = this.props;
    return (
      <Box flow={10} align="center" position="relative">
        <Box horizontal align="center" flow={5} px={10}>
          {this.renderDashes()}
        </Box>
        <Box position="absolute">
          {deviceReady && !error && loader}
          {error && errorIcon}
        </Box>
      </Box>
    );
  }
}

const CurrentActionIcon = ({
  type,
  needsUserInput
}: {
  type: CurrentActionType,
  needsUserInput?: boolean
}) =>
  type === "device" ? (
    <DeviceIcon needsUserInput={needsUserInput} />
  ) : (
    serverIcon
  );
class DeviceInteraction extends PureComponent<Props> {
  render() {
    const {
      needsUserInput,
      numberSteps,
      currentStep,
      error,
      currentActionType
    } = this.props;
    return (
      <Container error={error}>
        {computerIcon}
        <DashContainer
          number={numberSteps}
          currentStep={currentStep}
          error={error}
        />
        <CurrentActionIcon
          type={currentActionType}
          needsUserInput={needsUserInput}
        />
      </Container>
    );
  }
}

export default DeviceInteraction;
