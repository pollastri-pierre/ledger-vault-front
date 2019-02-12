// @flow
import React, { Component } from "react";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import QRCodeCameraPickerBubble from "./QRCodeCameraPickerBubble";

class CryptoAddressPicker extends Component<{
  id: string,
  value: string,
  isValid: boolean,
  onChange: string => any
}> {
  onChange = (e: any) => {
    this.props.onChange(e.currentTarget.value.trim());
  };

  render() {
    const { id, onChange, isValid, value, ...props } = this.props;
    return (
      <Input
        {...props}
        id={id}
        type="text"
        data-test="crypto-address-picker"
        onChange={this.onChange}
        error={!isValid}
        value={value}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        endAdornment={
          <InputAdornment position="end">
            <QRCodeCameraPickerBubble onPick={onChange} />
          </InputAdornment>
        }
      />
    );
  }
}

export default CryptoAddressPicker;
