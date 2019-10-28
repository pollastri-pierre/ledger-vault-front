// @flow
import React, { PureComponent } from "react";

import NextRequestMutation from "api/mutations/NextRequestMutation";
import connectData from "restlay/connectData";
import Button from "components/base/Button";
import type { Request } from "data/types";
import type { RestlayEnvironment } from "restlay/connectData";

type Props = {
  restlay: RestlayEnvironment,
  request: Request,
  onSuccess?: () => any,
};

class NextRequestButton extends PureComponent<Props> {
  triggerNext = async () => {
    const { request, restlay, onSuccess } = this.props;
    try {
      await restlay.commitMutation(
        new NextRequestMutation({ requestId: request.id }),
      );
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.log(err); // eslint-disable-line no-console
    }
  };

  render() {
    return (
      <Button type="filled" small onClick={this.triggerNext}>
        RETRY
      </Button>
    );
  }
}

export default connectData(NextRequestButton);
