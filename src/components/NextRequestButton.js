// @flow
import React, { PureComponent } from "react";

import NextRequestMutation from "api/mutations/NextRequestMutation";
import connectData from "restlay/connectData";
import Button from "components/legacy/Button";
import type { Request } from "data/types";
import type { RestlayEnvironment } from "restlay/connectData";

type Props = {
  restlay: RestlayEnvironment,
  request: Request,
};

type State = {
  isLoading: boolean,
};

class NextRequestButton extends PureComponent<Props, State> {
  state = {
    isLoading: false,
  };

  triggerNext = async () => {
    const { request, restlay } = this.props;
    try {
      this.setState({ isLoading: true });
      await restlay.commitMutation(
        new NextRequestMutation({ requestId: request.id }),
      );
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { isLoading } = this.state;
    return (
      <Button
        variant="filled"
        size="tiny"
        onClick={this.triggerNext}
        isLoading={isLoading}
      >
        RETRY
      </Button>
    );
  }
}

export default connectData(NextRequestButton);
