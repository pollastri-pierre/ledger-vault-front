//@flow
import React, { Component } from "react";
import "./SelectTab.css";
type Props = {
  tabs: string[],
  onChange: Function,
  selected: number,
  underline?: boolean
};

export default class SelectTab extends Component<Props, {}> {
  render() {
    const { tabs, onChange, selected, underline } = this.props;
    return (
      <div className={`tabs ${underline ? "underline" : ""}`}>
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
