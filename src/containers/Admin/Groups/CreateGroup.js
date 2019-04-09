// @flow
import React, { PureComponent } from "react";
import { Trans } from "react-i18next";
import connectData from "restlay/connectData";
import type { RestlayEnvironment } from "restlay/connectData";
import { createAndApprove } from "device/interactions/approveFlow";
import type { User, Group } from "data/types";
import type { Connection } from "restlay/ConnectionQuery";
import GroupsQuery from "api/queries/GroupsQuery";
import UsersQuery from "api/queries/UsersQuery";

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
  ModalFooter,
} from "components/base/Modal";

type Props = {
  operators: Connection<User>,
  restlay: RestlayEnvironment,
  close: () => void,
};

type State = {
  members: User[],
  name: string,
  dataTest?: string,
  description: string,
};

const inputProps = {
  maxLength: 19,
  onlyAscii: true,
};
// NOTE: refactor with the new ApproveRequestButton
class CreateGroup extends PureComponent<Props, State> {
  state = {
    members: [],
    name: "",
    description: "",
  };

  onChange = (val: { members: User[], groups: Group[] }) => {
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
      description,
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
            dataTest="group-name-input"
            fullWidth
            value={name}
            onChange={this.onChangeName}
            {...inputProps}
          />
          <InputField
            multiline
            dataTest="group-description-input"
            placeholder="Description"
            fullWidth
            value={description}
            onChange={this.onChangeDescription}
          />
          <Box flow={20} py={30}>
            <Box flow={10} horizontal align="center">
              <Text uppercase small i18nKey="group:create.members" />
              {members.length > 0 && <Text small>({members.length})</Text>}
            </Box>
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
    operators: UsersQuery,
  },
  initialVariables: {
    // TODO remove this when endpoint is not paginated anymore
    operators: 30,
  },
  propsToQueryParams: () => ({
    role: "OPERATOR",
  }),
});
