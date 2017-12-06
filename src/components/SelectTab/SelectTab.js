//@flow
import React, { Component } from "react";
import "./SelectTab.css";

type Props = {
  tabs: string[],
  onChange: Function,
  selected: number,
  theme?: "inline" | "header"
};

export default class SelectTab extends Component<Props, {}> {
  render() {
    const { tabs, onChange, selected } = this.props;
    const theme = this.props.theme ? this.props.theme : "header";
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
