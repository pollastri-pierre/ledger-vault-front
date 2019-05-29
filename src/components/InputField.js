// @flow
import React, { PureComponent } from "react";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";

type Props = {
  onChange: string => void,
  value: string,
  placeholder?: string,
  renderLeft?: ?React$Node,
  renderRight?: ?React$Node,
  textAlign?: string,
  maxLength?: number,
  dataTest?: string,
  onlyAscii?: boolean,
};

const isAscii = c => c.charCodeAt(0) <= 127;

class InputField extends PureComponent<Props> {
  handleChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    const { onChange } = this.props;
    onChange(this.sanitize(e.target.value));
  };

  sanitize = (str: string) => {
    const { maxLength, onlyAscii } = this.props;
    if (onlyAscii) {
      str = str
        .split("")
        .filter(isAscii)
        .join("");
    }
    if (maxLength) {
      str = str.substr(0, maxLength);
    }
    return str;
  };

  render() {
    const {
      value,
      placeholder,
      renderLeft,
      renderRight,
      textAlign,
      dataTest,
      onChange: _onChange,
      maxLength: _maxLength,
      onlyAscii: _onlyAscii,
      ...props
    } = this.props;
    return (
      <TextField
        autoComplete="off"
        fullWidth
        id={dataTest}
        value={value}
        placeholder={placeholder}
        onChange={this.handleChange}
        inputProps={{
          style: {
            textAlign,
          },
        }}
        InputProps={{
          startAdornment: renderLeft && (
            <InputAdornment position="start">{renderLeft}</InputAdornment>
          ),
          endAdornment: renderRight && (
            <InputAdornment position="end">{renderRight}</InputAdornment>
          ),
        }}
        {...props}
      />
    );
  }
}

export default InputField;
