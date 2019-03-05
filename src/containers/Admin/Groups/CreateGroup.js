// @flow
import React, { PureComponent } from "react";
import connectData from "restlay/connectData";
import type { RestlayEnvironment } from "restlay/connectData";
import DeviceInteraction from "components/DeviceInteraction";
import { createAndApprove } from "device/interactions/approveFlow";
import InputField from "components/InputField";
import type { Member, Group } from "data/types";
import GroupsQuery from "api/queries/GroupsQuery";
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
  restlay: RestlayEnvironment,
  close: () => void
};

type State = {
  members: Member[],
  name: string,
  description: string,
  isCreating: boolean
};

const inputProps = {
  maxLength: 19,
  onlyAscii: true
};

class CreateGroup extends PureComponent<Props, State> {
  state = {
    members: [],
    name: "",
    description: "",
    isCreating: false
  };

  onChange = (val: { members: Member[], groups: Group[] }) => {
    this.setState({ members: val.members });
  };

  onCreate = () => {
    this.setState({ isCreating: true });
  };

  onSuccess = () => {
    this.setState({ isCreating: false });
    this.props.restlay.fetchQuery(new GroupsQuery({}));
  };

  onError = error => {
    console.error(error);
    this.setState({ isCreating: false });
  };

  onChangeName = name => {
    this.setState({ name });
  };

  onChangeDescription = description => {
    this.setState({ description });
  };

  render() {
    const { close, operators } = this.props;
    const { members, name, description, isCreating } = this.state;
    const data = {
      members: members.map(m => m.id),
      name,
      description
    };

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
            <Text uppercase small i18nKey="group:create.members" />
            <SelectGroupsUsers
              members={operators}
              groups={[]}
              value={{ members, group: [] }}
              onChange={this.onChange}
            />
          </Box>
        </Box>
        <ModalFooter>
          {isCreating ? (
            <Box mb={15}>
              <DeviceInteraction
                interactions={createAndApprove}
                onSuccess={this.onSuccess}
                onError={this.onError}
                additionnalFields={{ data, type: "CREATE_GROUP" }}
              />
            </Box>
          ) : (
            <DialogButton
              highlight
              onTouchTap={this.onCreate}
              disabled={
                name === "" || description === "" || members.length === 0
              }
            >
              <Trans i18nKey="group:create.submit" />
            </DialogButton>
          )}
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
