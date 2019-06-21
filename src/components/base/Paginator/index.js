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

const MAX_LEFT_ITEMS = 8;

class Item extends PureComponent<ItemProps> {
  onChange = () => this.props.onChange(this.props.item);

  render() {
    const { selected, item } = this.props;
    return (
      <ItemContainer selected={selected} onClick={this.onChange}>
        <span>{item}</span>
      </ItemContainer>
    );
  }
}

class Paginator extends PureComponent<Props> {
  renderItems = () => {
    const { count, pageSize, page, onChange } = this.props;
    const nbItem = Math.ceil(count / pageSize);
    const items = [];
    const hasEllipsis = nbItem > 6;
    for (let i = 0; i < nbItem; i++) {
      if (hasEllipsis && i === MAX_LEFT_ITEMS) {
        items.push(<div key="ellipsis"> ... </div>);
        continue; // eslint-disable-line no-continue
      }
      if (hasEllipsis && i > MAX_LEFT_ITEMS && i !== nbItem - 1) continue; // eslint-disable-line no-continue
      items.push(
        <Item selected={i === page} key={i} item={i + 1} onChange={onChange} />,
      );
    }
    return items;
  };

  render() {
    return (
      <Box horizontal>
        <Container>{this.renderItems()}</Container>
      </Box>
    );
  }
}

const Container = styled.div`
  display: inline-flex;
  align-items: center;
`;

const ItemContainer = styled(Box).attrs({
  align: "center",
  justify: "center",
})`
  width: 30px;
  height: 30px;
  position: relative;
  user-select: none;

  span {
    position: relative;
  }

  &:active {
    font-weight: bold;
  }

  ${({ selected }) => `
    color: ${selected ? colors.ocean : "inherit"};
    font-weight: ${selected ? "bold" : "inherit"};
    cursor: ${selected ? "default" : "pointer"};
    pointer-events: ${selected ? "none" : "auto"};

    &:before {
      content: ' ';
      position: absolute;
      top: 2px;
      left: 2px;
      right: 2px;
      bottom: 2px;
      border-radius: 2px;
      background: ${selected ? "#fafafa" : "transparent"};
    }
  `}
`;
export default Paginator;
