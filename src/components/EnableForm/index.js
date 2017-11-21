//@flow
import React, { PureComponent } from "react";
import Checkbox from "../form/Checkbox";
import "./index.css";

type Props = {
  checked: boolean,
  toggle: Function,
  children: *
};

class EnableForm extends PureComponent<Props> {
  focusAndToggle = () => {
    // when we enable the form, we put the focus on the first input[type="text"]
    const { checked, toggle } = this.props;

    if (!checked) {
      const inputs = document.querySelectorAll("input[type=text]");
      if (inputs) {
        inputs[0].focus();
      }
    }
    toggle();
  };
  render() {
    const { checked, toggle, children } = this.props;
    return (
      <div className="enable-form">
        <div className="form-field-checkbox" onClick={this.focusAndToggle}>
          <label htmlFor="enable-field">Enable</label>
          <Checkbox
            checked={checked}
            handleInputChange={toggle}
            labelFor="enable-field"
          />
        </div>
        <div className={`enable-form-form ${!checked ? "disabled" : ""}`}>
          {children}
        </div>
      </div>
    );
  }
}

export default EnableForm;
