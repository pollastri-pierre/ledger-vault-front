// @flow
import React, { PureComponent } from "react";
import Box from "components/base/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import styled from "styled-components";
import colors from "shared/colors";
import TextField from "components/utils/TextField";
import { MdCreate, MdCheck, MdClear } from "react-icons/md";

type Props = {
  text: string,
  loading?: boolean,
  onChange: string => any
};

type State = {
  editMode: boolean,
  innerText: string
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
      props.loading || props.editMode ? "none" : "inline-block"};
  }
`;

const iconEdit = <MdCreate size={15} />;
const iconValidate = <MdCheck size={15} color={colors.green} />;
const iconCancel = <MdClear size={15} color={colors.grenade} />;

const spinner = (
  <CircularProgress
    size={20}
    color="primary"
    style={{
      position: "absolute",
      left: "50%",
      top: "50%",
      marginLeft: "-10px",
      marginTop: "-10px"
    }}
  />
);

const Action = styled(Box)`
  background: ${colors.cream};
  border-radius: 3px;
  width: 35px;
  height: 20px;
  cursor: pointer;
  &:hover {
    background: ${colors.pearl};
  }
`;

class EditableText extends PureComponent<Props, State> {
  state = {
    editMode: false,
    innerText: this.props.text
  };

  onFocus = () => {
    if (!this.props.loading) {
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
      editMode: false
    });
  };

  render() {
    const { loading } = this.props;
    const { editMode, innerText } = this.state;
    return (
      <Container align="flex-end" loading={loading}>
        {loading && spinner}
        <TextField
          variant="filled"
          rows={5}
          onFocus={this.onFocus}
          fullWidth
          multiline
          value={innerText}
          disabled={loading}
          onChange={this.onChangeText}
        />
        {editMode && (
          <Box flow={5} horizontal>
            <Action justify="center" align="center" onClick={this.onCancel}>
              {iconCancel}
            </Action>
            <Action justify="center" align="center" onClick={this.onValidate}>
              {iconValidate}
            </Action>
          </Box>
        )}
        <ContainerIcon loading={loading} editMode={editMode}>
          {iconEdit}
        </ContainerIcon>
      </Container>
    );
  }
}

export default EditableText;
