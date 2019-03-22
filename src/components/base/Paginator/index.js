// @flow
import styled from "styled-components";
import Box from "components/base/Box";
import React, { PureComponent } from "react";
import colors from "shared/colors";

type Props = {
  onChange: Function,
  page: number,
  count: number,
  pageSize: number,
};

type ItemProps = {
  selected: boolean,
  item: number,
  onChange: Function,
};
class Item extends PureComponent<ItemProps> {
  onChange = () => {
    this.props.onChange(this.props.item);
  };

  render() {
    const { selected, item } = this.props;
    return (
      <Container selected={selected} onClick={this.onChange}>
        {item}
      </Container>
    );
  }
}
class Paginator extends PureComponent<Props> {
  renderItems = () => {
    const { count, pageSize, page, onChange } = this.props;
    const nbItem = Math.ceil(count / pageSize);
    const items = [];
    for (let i = 0; i < nbItem; i++) {
      items.push(
        <Item selected={i === page} key={i} item={i + 1} onChange={onChange} />,
      );
    }
    return items;
  };

  render() {
    return (
      <Box horizontal align="center" flow={5}>
        {this.renderItems()}
      </Box>
    );
  }
}

const Container = styled(Box).attrs({
  align: "center",
  justify: "center",
})`
  width: 30px;
  height: 30px;
  background: ${p => (p.selected ? "#efefef" : "white")};
  color: ${colors.night};
  cursor: ${p => (p.selected ? "default" : "pointer")};
  border-radius: 3px;
  border: 1px solid ${colors.argile};
  &:hover {
    background: ${p => (p.selected ? "#efefef" : colors.cream)};
  }
`;
export default Paginator;
