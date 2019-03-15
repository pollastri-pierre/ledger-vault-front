// @flow

import Box from "components/base/Box";
import type { Group } from "data/types";
import EditableText from "components/base/EditableText";
import React, { PureComponent } from "react";
import connectData from "restlay/connectData";
import type { RestlayEnvironment } from "restlay/connectData";
import EditGroupDescriptionMutation from "api/mutations/EditGroupDescriptionMutation";

type Props = {
  group: Group,
  restlay: RestlayEnvironment,
};

type State = {
  loading: boolean,
};

class GroupDetailsDescription extends PureComponent<Props, State> {
  state = {
    loading: false,
  };

  onChange = async (description: string) => {
    this.setState({ loading: true });
    const { restlay, group } = this.props;
    try {
      await restlay.commitMutation(
        new EditGroupDescriptionMutation({ group, description }),
      );
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { group } = this.props;
    const { loading } = this.state;
    return (
      <Box py={20} flow={20}>
        <EditableText
          text={group.description || ""}
          onChange={this.onChange}
          loading={loading}
          isEditDisabled={group.status !== "ACTIVE"}
        />
      </Box>
    );
  }
}

export default connectData(GroupDetailsDescription);
