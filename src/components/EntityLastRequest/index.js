// @flow

import React, { PureComponent } from "react";
import Box from "components/base/Box";
import DiffViewer from "components/EntityLastRequest/DiffViewer";
import DateFormat from "components/DateFormat";
import LineRow from "components/LineRow";
import Text from "components/base/Text";
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
        <Box>
          <LineRow label="Request">
            <Text i18nKey={`request:type.${entity.last_request.type}`} />
          </LineRow>
          <LineRow label="Expiration date">
            <DateFormat
              date={entity.last_request.expiration_date || new Date()}
            />
          </LineRow>
        </Box>
        {hasPendingEdit(entity) && (
          <DiffViewer entity={entity} additionalFields={additionalFields} />
        )}
      </Box>
    );
  }
}

export default EntityLastRequest;
