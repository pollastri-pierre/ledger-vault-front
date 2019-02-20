// @flow
import React, { PureComponent } from "react";
import connectData from "restlay/connectData";
import InputField from "components/InputField";
import type { Member, Group } from "data/types";
import Box from "components/base/Box";
import { Trans } from "react-i18next";
import Text from "components/base/Text";
import ModalLoading from "components/ModalLoading";
import SelectGroupsUsers from "components/SelectGroupsUsers";
import MembersQuery from "api/queries/MembersQuery";
import DialogButton from "components/buttons/DialogButton";

import {
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter
} from "components/base/Modal";

type Props = {
  operators: Member[],
  close: () => void
};

type State = {
  selected: Member[],
  name: string,
  description: string
};

const inputProps = {
  maxLength: 19,
  onlyAscii: true
};

class CreateGroup extends PureComponent<Props, State> {
  state = {
    selected: [],
    name: "",
    description: ""
  };

  onChange = (val: { members: Member[], groups: Group[] }) => {
    this.setState({ selected: val.members });
  };

  onCreate = () => {
    console.warn("TODO create the group");
    this.props.close();
  };

  onChangeName = name => {
    this.setState({ name });
  };

  onChangeDescription = description => {
    this.setState({ description });
  };

  render() {
    const { close, operators } = this.props;
    const { selected, name, description } = this.state;
    return (
      <ModalBody height={700} onClose={close}>
        <ModalHeader>
          <ModalTitle>
            <Trans i18nKey="group:create.title" />
          </ModalTitle>
        </ModalHeader>
        <Box flow={20}>
          <InputField
            autoFocus
            placeholder="Name"
            fullWidth
            value={name}
            onChange={this.onChangeName}
            {...inputProps}
          />
          <InputField
            multiline
            placeholder="Description"
            fullWidth
            value={description}
            onChange={this.onChangeDescription}
          />
          <Box flow={20} py={30}>
            <Text uppercase small>
              <Trans i18nKey="group:create.members" />
            </Text>
            <SelectGroupsUsers
              members={operators}
              groups={[]}
              value={{ members: selected, group: [] }}
              onChange={this.onChange}
            />
          </Box>
        </Box>
        <ModalFooter>
          <DialogButton
            highlight
            onTouchTap={this.onCreate}
            disabled={
              name === "" || description === "" || selected.length === 0
            }
          >
            <Trans i18nKey="group:create.submit" />
          </DialogButton>
        </ModalFooter>
      </ModalBody>
    );
  }
}

const RenderLoading = () => <ModalLoading height={700} />;
export default connectData(CreateGroup, {
  RenderLoading,
  queries: {
    operators: MembersQuery
  },
  propsToQueryParams: () => ({
    memberRole: "operator"
  })
});
