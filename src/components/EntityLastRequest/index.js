// @flow

import React, { PureComponent } from "react";
import Box from "components/base/Box";
import DiffViewer from "components/EntityLastRequest/DiffViewer";
import type { Entity } from "data/types";
import { hasPendingEdit } from "utils/entities";

type Props = {
  entity: Entity,
  additionalFields?: Object,
};

class EntityLastRequest extends PureComponent<Props> {
  render() {
    const { entity, additionalFields } = this.props;

    if (!entity.last_request) return null;

    return (
      <Box flow={20}>
        {hasPendingEdit(entity) && (
          <DiffViewer entity={entity} additionalFields={additionalFields} />
        )}
      </Box>
    );
  }
}

export default EntityLastRequest;
