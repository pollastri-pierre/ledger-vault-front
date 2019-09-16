// @flow

import React, { PureComponent } from "react";
import { FaRegEdit } from "react-icons/fa";
import Text from "components/base/Text";
import Box from "components/base/Box";
import Button from "components/legacy/Button";
import { InputText } from "components/base/form";

import colors from "shared/colors";

type Props = {
  value: string,
  onChange: string => void,
  InputComponent?: React$ComponentType<*>,
  inputProps?: Object,
  getSaveDisabled?: string => boolean,
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
    const { value, InputComponent, inputProps, getSaveDisabled } = this.props;
    const Input = InputComponent || InputText;
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
          <Box horizontal align="center" flow={5}>
            <Input
              autoFocus
              value={localValue}
              onChange={this.handleChange}
              {...inputProps}
            />
            <Button
              size="small"
              type="submit"
              variant="filled"
              onClick={this.onConfirm}
              disabled={getSaveDisabled ? getSaveDisabled(localValue) : false}
            >
              Save
            </Button>
          </Box>
        )}
      </Box>
    );
  }
}

export default EditableField;
