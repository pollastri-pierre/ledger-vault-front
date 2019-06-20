// @flow
import React, { PureComponent } from "react";
import Box from "components/base/Box";
import Text from "components/base/Text";
import styled, { keyframes } from "styled-components";
import colors from "shared/colors";
import { MdComputer, MdTouchApp, MdError } from "react-icons/md";
import CircularProgress from "@material-ui/core/CircularProgress";
import { FaMobileAlt, FaServer } from "react-icons/fa";
import type { Interaction } from "components/DeviceInteraction";

export type CurrentActionType = "device" | "server";

type Props = {
  interaction: Interaction,
  numberSteps: number,
  currentStep: ?number,
  error?: boolean,
  light?: boolean,
};

const computerIcon = <MdComputer size={20} />;
const touchRequiredIcon = <MdTouchApp size={20} />;
const serverIcon = <FaServer size={20} />;
const blueIcon = <FaMobileAlt size={20} />;
const loader = <CircularProgress size={15} />;
const errorIcon = <MdError size={15} color={colors.grenade} />;

const Container = styled(Box).attrs({
  px: 20,
  horizontal: true,
  align: "center",
})`
  height: 60px;
  border-radius: 5px;
  opacity: ${p => (p.error ? "0.5" : "1")};
  position: relative;
  background: ${p => (p.light ? "white" : "#f5f5f5")};
  border: 1px solid #e9e9e9;
  color: #555;
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
  background: ${p => (p.done ? colors.green : "#777")};
  opacity: ${p => (p.done || p.active ? 1 : 0.1)};
`;

const bounce = keyframes`
 from {
    transform: translateY(-5px);
 }
 50% {
    transform: translateY(0px);
 }
 to {
    transform: translateY(-5px);
 }
`;

const Tooltip = styled(Box)`
  -webkit-font-smoothing: antialiased;
  animation: ${bounce} 1000ms cubic-bezier(0.61, 0.22, 0.42, 0.77) infinite;
  background: ${colors.night};
  color: white;
  user-select: none;
  border-radius: 5px;
  top: 100%;
  left: 8px;
  z-index: 1;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.3);
  font-weight: bold;
  text-align: center;
  padding: 12px;
  position: absolute;
  width: 200px;
  &:before {
    position: absolute;
    top: -5px;
    left: 16px;
    display: block;
    content: "";
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 6px 6px 6px;
    border-color: transparent transparent #1d2028 transparent;
  }
`;

type PropsDash = {
  number: number,
  currentStep: ?number,
  error: ?boolean,
};

type StateDash = {
  intervalId: ?IntervalID,
  deviceReady: ?boolean,
  dashActive: number,
};
class DashContainer extends PureComponent<PropsDash, StateDash> {
  state = {
    intervalId: null,
    deviceReady: false,
    dashActive: 0,
  };

  static defaultProps = {
    number: 3,
  };

  componentDidMount() {
    const intervalId = setInterval(() => this.update(), 200);
    this.setState({ intervalId });
  }

  static getDerivedStateFromProps(props, state) {
    const { currentStep } = props;
    return {
      ...state,
      deviceReady: currentStep > 0,
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
      dashActive: newActive,
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
        />,
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

const LeftIcon = ({
  type,
  needsUserInput,
}: {
  type: CurrentActionType,
  needsUserInput?: boolean,
}) =>
  type === "device" ? (
    <DeviceIcon needsUserInput={needsUserInput} />
  ) : (
    computerIcon
  );

const RightIcon = ({ type }: { type: CurrentActionType }) =>
  type === "device" ? computerIcon : serverIcon;

class DeviceInteractionAnimation extends PureComponent<Props> {
  render() {
    const { numberSteps, interaction, currentStep, error, light } = this.props;

    const { needsUserInput, tooltip } = interaction;
    const currentActionType = interaction.device ? "device" : "server";

    return (
      <Container error={error} light={light}>
        <LeftIcon type={currentActionType} needsUserInput={needsUserInput} />
        <DashContainer
          number={numberSteps}
          currentStep={currentStep}
          error={error}
        />
        <RightIcon type={currentActionType} />
        {needsUserInput && (
          <Tooltip right>
            {tooltip || <Text small i18nKey="common:approve_device" />}
          </Tooltip>
        )}
      </Container>
    );
  }
}

export default DeviceInteractionAnimation;
