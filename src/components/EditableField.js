// @flow

import React, { PureComponent, Fragment } from "react";
import { FaRegEdit, FaCheck } from "react-icons/fa";
import Text from "components/base/Text";
import Box from "components/base/Box";
import InputField from "components/InputField";

import colors from "shared/colors";

type Props = {
  value: string,
  onChange: string => void
};
type State = {
  editMode: boolean,
  localValue: string
};
const styles = {
  cursor: {
    cursor: "pointer"
  }
};
class EditableField extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      editMode: false,
      localValue: props.value
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
    const { onChange } = this.props;
    const { localValue } = this.state;
    onChange(localValue);
    this.toggleEditMode();
  };

  render() {
    const { editMode, localValue } = this.state;
    const { value } = this.props;
    return (
      <Box horizontal align="center" flow={10}>
        {!editMode ? (
          <Fragment>
            <Text>{value}</Text>
            <FaRegEdit
              style={styles.cursor}
              color={colors.lead}
              size={12}
              onClick={this.toggleEditMode}
            />
          </Fragment>
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
          />
        )}
      </Box>
    );
  }
}

export default EditableField;
