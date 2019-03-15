// @flow
import React, { PureComponent } from "react";
import Box from "components/base/Box";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import styled from "styled-components";
import colors from "shared/colors";
import TextField from "components/utils/TextField";
import { MdCreate, MdCheck, MdClear } from "react-icons/md";

type Props = {
  text: string,
  loading?: boolean,
  onChange: string => any,
  isEditDisabled?: boolean,
};

type State = {
  editMode: boolean,
  innerText: string,
};

const Container = styled(Box)`
  position: relative;
  opacity: ${props => (props.loading ? 0.5 : 1)};
  cursor: ${props => (props.loading ? "progress" : "text")};
`;
const ContainerIcon = styled(Box)`
  display: none;
  position: absolute;
  right: -30px;
  bottom: 0px;
  ${Container}:hover & {
    display: ${props =>
      props.loading || props.editMode || props.isEditDisabled
        ? "none"
        : "inline-block"};
  }
`;

const iconEdit = <MdCreate size={15} />;
const iconValidate = <MdCheck size={25} />;
const iconCancel = <MdClear size={25} />;

const spinner = (
  <CircularProgress
    size={20}
    color="primary"
    style={{
      position: "absolute",
      left: "50%",
      top: "50%",
      marginLeft: "-10px",
      marginTop: "-10px",
    }}
  />
);

class EditableText extends PureComponent<Props, State> {
  state = {
    editMode: false,
    innerText: this.props.text,
  };

  onFocus = () => {
    const { loading, isEditDisabled } = this.props;
    if (!loading && !isEditDisabled) {
      this.setState({ editMode: true });
    }
  };

  onChangeText = (e: SyntheticEvent<HTMLInputElement>) => {
    this.setState({ innerText: e.currentTarget.value });
  };

  onValidate = () => {
    this.props.onChange(this.state.innerText);
    this.setState({ editMode: false });
  };

  onCancel = () => {
    this.setState({
      innerText: this.props.text,
      editMode: false,
    });
  };

  render() {
    const { loading, isEditDisabled } = this.props;
    const { editMode, innerText } = this.state;
    return (
      <Container align="flex-end" loading={loading}>
        {loading && spinner}
        <TextField
          rows={5}
          style={{ background: colors.cream }}
          onFocus={this.onFocus}
          fullWidth
          multiline
          value={innerText}
          inputProps={{ style: { padding: 20 } }}
          disabled={loading || isEditDisabled}
          onChange={this.onChangeText}
        />
        {editMode && (
          <Box pt={5} flow={5} horizontal>
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              onClick={this.onCancel}
            >
              {iconCancel}
            </Button>

            <Button
              size="small"
              variant="outlined"
              color="primary"
              onClick={this.onValidate}
            >
              {iconValidate}
            </Button>
          </Box>
        )}
        <ContainerIcon
          loading={loading}
          editMode={editMode}
          isEditDisabled={isEditDisabled}
        >
          {iconEdit}
        </ContainerIcon>
      </Container>
    );
  }
}

export default EditableText;
