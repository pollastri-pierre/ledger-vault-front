// @flow

import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { FieldSelect } from "components/filters";
import { translateStatus } from "components/Status";
import { remapStatus } from "components/EntityStatus";
import type { FieldsGroupProps } from "components/filters/types";

type Props = FieldsGroupProps & {
  targetType?: string,
  statuses: string[],
};

export default function FilterFieldStatuses(props: Props) {
  //  WTF eslint is complaining but statuses type is declared
  const { statuses, targetType, ...p } = props; // eslint-disable-line react/prop-types
  const { t } = useTranslation();

  const options = useMemo(
    () =>
      statuses.map(s => ({
        value: s,
        label: translateStatus(targetType ? remapStatus(s, targetType) : s, t),
      })),
    [statuses, targetType, t],
  );

  return (
    <FieldSelect
      title="Status"
      queryKey="status"
      options={options}
      closeMenuOnSelect={false}
      controlShouldRenderValue={false}
      hideSelectedOptions={false}
      withCheckboxes
      width={200}
      {...p}
    />
  );
}
