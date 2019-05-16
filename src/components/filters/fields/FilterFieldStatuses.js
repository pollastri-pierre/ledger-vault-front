// @flow

import React, { useMemo } from "react";

import { FieldSelect } from "components/filters";
import Status from "components/Status";
import type { FieldsGroupProps } from "components/filters/types";

type Option = { value: string, label: string };

type Props = FieldsGroupProps & {
  statuses: string[],
};

export default function FilterFieldStatuses(props: Props) {
  //  WTF eslint is complaining but statuses type is declared
  const { statuses, ...p } = props; // eslint-disable-line react/prop-types

  const options = useMemo(
    () =>
      statuses.map(s => ({
        value: s,
        label: <Status textOnly status={s} />,
      })),
    [statuses],
  );

  return (
    <FieldSelect
      title="Status"
      queryKey="status"
      options={options}
      closeMenuOnSelect={false}
      RenderInWrap={({ data }: { data: Option }) => {
        return <Status status={data.value} />;
      }}
      {...p}
    />
  );
}
