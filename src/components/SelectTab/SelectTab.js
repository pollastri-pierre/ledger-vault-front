//@flow
import React, { Component } from "react";

type Props = {
  tabs: string[],
  onChange: Function,
  selected: number,
  theme: "inline" | "header"
};

export default class SelectTab extends Component<Props, {}> {
  static defaultProps = {
    theme: "header"
  };
  render() {
    const { tabs, onChange, selected, theme } = this.props;
    return (
      <div className={`tabs ${theme}`}>
        {tabs.map((elem, i) => {
          return (
            <div
              className={`tab ${i === selected ? "selected" : ""}`}
              onClick={() => onChange(i)}
              key={i}
            >
              {elem}
            </div>
          );
        })}
      </div>
    );
  }
}
