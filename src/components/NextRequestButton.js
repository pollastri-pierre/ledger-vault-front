// @flow
import React, { PureComponent } from "react";

import NextRequestMutation from "api/mutations/NextRequestMutation";
import connectData from "restlay/connectData";
import Button from "components/base/Button";
import type { GenericRequest } from "data/types";
import type { RestlayEnvironment } from "restlay/connectData";

type Props = {
  restlay: RestlayEnvironment,
  request: GenericRequest,
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
      <Button type="filled" size="small" onClick={this.triggerNext}>
        RETRY
      </Button>
    );
  }
}

export default connectData(NextRequestButton);
