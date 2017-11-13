//@flow
import ContentEditable from "react-contenteditable";
import React, { Component } from "react";

class EditableComponent extends Component<
  {
    value: string,
    className: string,
    placeholder: string,
    onChange: Function
  },
  {
    html: string
  }
> {
  static defaultProps = {
    value: "",
    className: "",
    placeholder: ""
  };
  state = {
    html: this.props.value
  };

  handleChange = (evt: *) => {
    this.props.onChange(evt.target.value);
  };

  render() {
    return (
      <ContentEditable
        html={this.state.html}
        className={this.props.className}
        disabled={false}
        placeholder={this.props.placeholder}
        onChange={this.handleChange}
      />
    );
  }
}

export default EditableComponent;
