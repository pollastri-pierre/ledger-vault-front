//@flow
import React, { Component } from "react";
import "./SelectTab.css";
type Props = {
  tabs: string[],
  onChange: Function,
  selected: number
};

export default class SelectTab extends Component<Props, {}> {
  render() {
    const { tabs, onChange, selected } = this.props;
    return (
      <div className="tabs">
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
