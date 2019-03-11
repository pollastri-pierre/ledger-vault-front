// @flow
import React, { PureComponent } from "react";
import { Trans } from "react-i18next";
import connectData from "restlay/connectData";
import type { RestlayEnvironment } from "restlay/connectData";
import { createAndApprove } from "device/interactions/approveFlow";
import type { Member, Group } from "data/types";
import type { Connection } from "restlay/ConnectionQuery";
import GroupsQuery from "api/queries/GroupsQuery";
import MembersQuery from "api/queries/MembersQuery";

import InputField from "components/InputField";
import Box from "components/base/Box";
import Text from "components/base/Text";
import ModalLoading from "components/ModalLoading";
import SelectGroupsUsers from "components/SelectGroupsUsers";
import ApproveRequestButton from "components/ApproveRequestButton";
import {
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter
} from "components/base/Modal";

type Props = {
  operators: Connection<Member>,
  restlay: RestlayEnvironment,
  close: () => void
};

type State = {
  members: Member[],
  name: string,
  description: string
};

const inputProps = {
  maxLength: 19,
  onlyAscii: true
};
// NOTE: refactor with the new ApproveRequestButton
class CreateGroup extends PureComponent<Props, State> {
  state = {
    members: [],
    name: "",
    description: ""
  };

  onChange = (val: { members: Member[], groups: Group[] }) => {
    this.setState({ members: val.members });
  };

  onSuccess = () => {
    const { restlay, close } = this.props;
    restlay.fetchQuery(new GroupsQuery({}));
    close();
  };

  onChangeName = name => {
    this.setState({ name });
  };

  onChangeDescription = description => {
    this.setState({ description });
  };

  render() {
    const { close, operators } = this.props;
    const { members, name, description } = this.state;
    const data = {
      members: members.map(m => m.id),
      name,
      description
    };

    // TODO need an endpoint not paginated for this
    const listOperators = operators.edges.map(e => e.node);

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
              members={listOperators}
              groups={[]}
              value={{ members, group: [] }}
              onChange={this.onChange}
            />
          </Box>
        </Box>
        <ModalFooter>
          <ApproveRequestButton
            interactions={createAndApprove}
            onSuccess={this.onSuccess}
            onError={null}
            additionalFields={{ data, type: "CREATE_GROUP" }}
            disabled={name === "" || description === "" || members.length === 0}
            buttonLabel={<Trans i18nKey="group:create.submit" />}
          />
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
  initialVariables: {
    // TODO remove this when endpoint is not paginated anymore
    operators: 30
  },
  propsToQueryParams: () => ({
    memberRole: "OPERATOR"
  })
});
