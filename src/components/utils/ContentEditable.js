import ContentEditable from "react-contenteditable";
import PropTypes from "prop-types";
import React, { Component } from "react";

class EditableComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      html: props.value
    };
  }

  handleChange = evt => {
    this.props.onChange(evt.target.value);
    // this.setState({ html: evt.target.value });
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

EditableComponent.defaultProps = {
  value: "",
  className: "",
  placeholder: ""
};

EditableComponent.propTypes = {
  value: PropTypes.string,
  className: PropTypes.string,
  placeholder: PropTypes.string
};

export default EditableComponent;
