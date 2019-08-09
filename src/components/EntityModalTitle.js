// @flow
import React, { PureComponent } from "react";
import Text from "components/base/Text";
import { ModalTitle } from "components/base/Modal";
import RequestTitle from "components/RequestTitle";

import type { Entity } from "data/types";

type Props = {
  title: string,
  entity: Entity,
};

class EntityModalTitle extends PureComponent<Props> {
  render() {
    const { title, entity } = this.props;

    return (
      <ModalTitle>
        <Text header bold>
          {entity.status === "ACTIVE"
            ? title
            : entity.last_request && (
                <RequestTitle
                  type={entity.last_request.type}
                  entityTitle={title}
                />
              )}
        </Text>
      </ModalTitle>
    );
  }
}

export default EntityModalTitle;
