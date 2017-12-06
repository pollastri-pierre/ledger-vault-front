//@flow
import React, { Component } from "react";
import PropTypes from "prop-types";
import ArrowDown from "../icons/ArrowDown";
import "../TotalBalanceFilter/TotalBalanceFilter.css";
import PopBubble from "../utils/PopBubble.js";
import "./index.css";

const contextTypes = {
  onOptionClick: PropTypes.func.isRequired
};

export class Option<T> extends Component<{
  children: string | React$Node,
  value: T, // data to attach to the option that will be passed to onChange
  selected?: boolean
}> {
  context: {
    onOptionClick: T => void
  };
  static contextTypes = contextTypes;
  render() {
    const { selected, value, children } = this.props;
    const { onOptionClick } = this.context;
    return (
      <div
        className={`option ${selected ? "selected" : ""}`}
        onClick={() => onOptionClick(value)}
      >
        {children}
      </div>
    );
  }
}

// TODO we need to have a max-height and scroll because on big select, it will go off screen (see Settings screen)
export class Select<T> extends Component<
  {
    onChange: (value: T) => void,
    children: React$Node,
    theme: "blue" | "black"
  },
  {
    isOpen: boolean
  }
> {
  static childContextTypes = contextTypes;
  filter: ?HTMLElement;

  static defaultProps = {
    theme: "blue"
  };

  state = {
    isOpen: false
  };

  getChildContext() {
    return {
      onOptionClick: this.onOptionClick
    };
  }

  onFilterRef = (el: *) => {
    this.filter = el;
  };

  onOptionClick = (value: T) => {
    this.close();
    this.props.onChange(value);
  };

  close = () => {
    this.setState({ isOpen: false });
  };

  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  render() {
    const { children, theme } = this.props;
    const { isOpen } = this.state;
    const arrayChildren = React.Children.toArray(children);
    const selectedOption =
      arrayChildren.find(({ props }) => props.selected) || arrayChildren[0];
    return (
      <div className="Select">
        <div
          className={`LabelSelectField ${theme}`}
          ref={this.onFilterRef}
          onClick={() => this.toggle()}
        >
          <ArrowDown className="ArrowDown" />
          <span className="label">{selectedOption}</span>
        </div>
        <PopBubble
          open={isOpen}
          anchorEl={this.filter}
          onRequestClose={this.close}
          className="Select-menu"
          style={{
            boxShadow:
              "0 0 5px 0 rgba(0, 0, 0, 0.04), 0 10px 10px 0 rgba(0, 0, 0, 0.04)",
            padding: "20px",
            fontSize: "11px",
            textAlign: "right"
          }}
        >
          {children}
        </PopBubble>
      </div>
    );
  }
}
