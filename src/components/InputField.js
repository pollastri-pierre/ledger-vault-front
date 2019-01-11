//@flow
import React, { PureComponent } from "react";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";

type Props = {
  onChange: string => void,
  value: string,
  placeholder?: string,
  renderLeft?: ?React$Node,
  renderRight?: ?React$Node,
  textAlign?: string
};

class InputField extends PureComponent<Props> {
  handleChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    const { onChange } = this.props;
    onChange(e.target.value);
  };

  render() {
    const {
      value,
      placeholder,
      renderLeft,
      renderRight,
      onChange: _onChange,
      textAlign,
      ...props
    } = this.props;
    return (
      <TextField
        fullWidth
        value={value}
        placeholder={placeholder}
        onChange={this.handleChange}
        inputProps={{
          style: {
            textAlign
          }
        }}
        InputProps={{
          startAdornment: renderLeft && (
            <InputAdornment position="start">{renderLeft}</InputAdornment>
          ),
          endAdornment: renderRight && (
            <InputAdornment position="end">{renderRight}</InputAdornment>
          )
        }}
        {...props}
      />
    );
  }
}

export default InputField;
