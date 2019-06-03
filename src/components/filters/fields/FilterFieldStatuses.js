// @flow

import React, { useMemo } from "react";

import { FieldSelect } from "components/filters";
import Status from "components/Status";
import { remapStatus } from "components/EntityStatus";
import type { FieldsGroupProps } from "components/filters/types";

type Option = { value: string, label: string };

type Props = FieldsGroupProps & {
  targetType?: string,
  statuses: string[],
};

export default function FilterFieldStatuses(props: Props) {
  //  WTF eslint is complaining but statuses type is declared
  const { statuses, targetType, ...p } = props; // eslint-disable-line react/prop-types

  const options = useMemo(
    () =>
      statuses.map(s => ({
        value: s,
        label: (
          <Status
            textOnly
            status={targetType ? remapStatus(s, targetType) : s}
          />
        ),
      })),
    [statuses, targetType],
  );

  return (
    <FieldSelect
      title="Status"
      queryKey="status"
      options={options}
      closeMenuOnSelect={false}
      RenderInWrap={({ data }: { data: Option }) => {
        const status = targetType
          ? remapStatus(data.value, targetType)
          : data.value;
        return <Status status={status} />;
      }}
      {...p}
    />
  );
}
