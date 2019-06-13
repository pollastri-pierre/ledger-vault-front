// @flow

import React, { PureComponent } from "react";
import { FaRegEdit, FaCheck } from "react-icons/fa";
import Text from "components/base/Text";
import Box from "components/base/Box";
import InputField from "components/InputField";

import colors from "shared/colors";

type Props = {
  value: string,
  onChange: string => void,
  inputProps?: Object,
};
type State = {
  editMode: boolean,
  localValue: string,
};
const styles = {
  cursor: {
    cursor: "pointer",
  },
};
class EditableField extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      editMode: false,
      localValue: props.value,
    };
  }

  handleChange = (value: string) => {
    this.setState({ localValue: value });
  };

  toggleEditMode = () => {
    const { editMode } = this.state;
    this.setState({ editMode: !editMode });
  };

  onConfirm = () => {
    const { onChange, value } = this.props;
    const { localValue } = this.state;
    if (localValue === "") {
      this.setState({ localValue: value });
    } else {
      onChange(localValue);
    }
    this.toggleEditMode();
  };

  render() {
    const { editMode, localValue } = this.state;
    const { value, inputProps } = this.props;
    return (
      <Box horizontal align="center" flow={10}>
        {!editMode ? (
          <>
            <Text>{value}</Text>
            <FaRegEdit
              style={styles.cursor}
              color={colors.lead}
              size={12}
              onClick={this.toggleEditMode}
            />
          </>
        ) : (
          <InputField
            value={localValue}
            onChange={this.handleChange}
            renderRight={
              <FaCheck
                color={colors.green}
                style={styles.cursor}
                onClick={this.onConfirm}
              />
            }
            {...inputProps}
          />
        )}
      </Box>
    );
  }
}

export default EditableField;
