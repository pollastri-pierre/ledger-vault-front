// @flow
import React, { PureComponent } from "react";
import Box from "components/base/Box";
import styled from "styled-components";
import colors from "shared/colors";
import { MdComputer } from "react-icons/md";
import { FaMobileAlt } from "react-icons/fa";

type Props = {};

const computerIcon = <MdComputer size={20} />;
const blueIcon = <FaMobileAlt size={20} />;

const Container = styled(Box).attrs({
  p: 20,
  horizontal: true,
  align: "center"
})`
  border-radius: 5px;
  width: 140px;
  background: ${colors.pearl};
`;

const Dash = styled(Box)`
  width: 10px;
  height: 2px;
  background: black;
  opacity: ${p => (p.active ? 1 : 0.1)};
`;

type PropsDash = {
  number: number
};

type StateDash = {
  intervalId: ?IntervalID,
  dashActive: number
};
class DashContainer extends PureComponent<PropsDash, StateDash> {
  state = {
    intervalId: null,
    dashActive: 0
  };

  static defaultProps = {
    number: 3
  };

  componentDidMount() {
    const intervalId = setInterval(() => this.update(), 200);
    this.setState({ intervalId });
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
    const { number } = this.props;
    const { dashActive } = this.state;

    const rows = [];
    for (let i = 0; i < number; i++) {
      rows.push(<Dash key={i} active={dashActive === i} />);
    }
    return rows;
  };

  render() {
    return (
      <Box horizontal align="center" flow={5} mr={5} ml={5}>
        {this.renderDashes()}
      </Box>
    );
  }
}

class DeviceInteraction extends PureComponent<Props> {
  render() {
    return (
      <Container>
        {blueIcon}
        <DashContainer />
        {computerIcon}
      </Container>
    );
  }
}

export default DeviceInteraction;
