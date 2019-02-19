// @flow

import Box from "components/base/Box";
import type { Group } from "data/types";
import EditableText from "components/base/EditableText";
import React, { PureComponent } from "react";

type Props = {
  group: Group
};

type State = {
  loading: boolean
};

const delay = ms => new Promise(success => setTimeout(success, ms));

class GroupDetailsDescription extends PureComponent<Props, State> {
  state = {
    loading: false
  };

  onChange = async () => {
    console.warn("TODO: udpate description with a Query");
    this.setState({ loading: true });
    await delay(2000);
    this.setState({ loading: false });
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
        />
      </Box>
    );
  }
}

export default GroupDetailsDescription;
