//@flow
import React, { Component } from "react";
import ArrowDown from "../icons/ArrowDown";
import "../TotalBalanceFilter/TotalBalanceFilter.css";
import _ from "lodash";
import PopBubble from "../utils/PopBubble.js";
import "./CustomSelectField.css";

class CustomSelectField<T: { title: string }> extends Component<*, *> {
  props: {
    values: Array<T>,
    selected: T,
    onChange: (value: *) => void
  };
  state: * = {
    isOpen: false
  };
  filter: ?HTMLElement;

  onChange = (value: *) => {
    this.props.onChange(value);
  };

  close = () => {
    this.setState({ isOpen: false });
  };

  toggle = () => this.setState({ isOpen: !this.state.isOpen });

  render() {
    const { selected, values } = this.props;
    const { isOpen } = this.state;
    return (
      <div className="CustomSelectField">
        <div
          className="LabelSelectField"
          ref={el => (this.filter = el)}
          onClick={() => this.toggle()}
        >
          <ArrowDown className="ArrowDown" />
          <span className="label">{selected.title}</span>
        </div>
        <PopBubble
          open={isOpen}
          anchorEl={this.filter}
          onRequestClose={this.close}
          style={{
            boxShadow:
              "0 0 5px 0 rgba(0, 0, 0, 0.04), 0 10px 10px 0 rgba(0, 0, 0, 0.04)",
            padding: "20px",
            fontSize: "11px",
            textAlign: "right"
          }}
        >
          {_.map(values, (value, i) => (
            <div
              key={i}
              className={`menuElem ${
                selected.title === value.title ? "selected" : ""
              }`}
              onClick={() => {
                this.close();
                this.onChange(value);
              }}
            >
              {value.title}
            </div>
          ))}
        </PopBubble>
      </div>
    );
  }
}

export default CustomSelectField;
