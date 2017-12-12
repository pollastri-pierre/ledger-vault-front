//@flow
import React, { Component } from "react";
import Input, { InputAdornment } from "material-ui/Input";
import QRCodeCameraPickerBubble from "./QRCodeCameraPickerBubble";

class CryptoAddressPicker extends Component<{
  id: string,
  value: string,
  isValid: boolean,
  onChange: string => void
}> {
  onChange = (e: SyntheticEvent<HTMLInputElement>) => {
    this.props.onChange(e.currentTarget.value.trim());
  };
  render() {
    const { id, onChange, isValid, value } = this.props;
    return (
      <Input
        id={id}
        type="text"
        onChange={this.onChange}
        error={!isValid}
        value={value}
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
