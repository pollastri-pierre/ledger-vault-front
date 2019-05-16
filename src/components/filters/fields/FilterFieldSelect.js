// @flow

import React, { useCallback, useMemo } from "react";
import type { ObjectParameter } from "query-string";

import { WrappableField } from "components/filters";
import Select from "components/base/Select";
import Box from "components/base/Box";
import Text from "components/base/Text";

import type { FieldProps } from "components/filters";

type Option = {
  value: string,
  label: string,
  data: *,
};

type Props = FieldProps & {
  placeholder: string,
  options: Option[],
  title: string,
  single: boolean,
  RenderInWrap: React$ComponentType<*>,
};

export default function FilterFieldSelect(props: Props) {
  const {
    placeholder,
    queryParams,
    updateQueryParams,
    options,
    title,
    queryKey,
    single,
    RenderInWrap,
  } = props;

  const resolveOptions = useCallback(
    (arr: $ReadOnlyArray<ObjectParameter>): Option[] => {
      return arr.map(s => options.find(o => o.value === s)).filter(Boolean);
    },
    [options],
  );

  const values = useMemo((): Option[] => {
    if (!queryParams[queryKey]) return [];
    if (typeof queryParams[queryKey] === "string")
      return resolveOptions([queryParams[queryKey]]);
    if (Array.isArray(queryParams[queryKey]))
      return resolveOptions(queryParams[queryKey]);
    return [];
  }, [resolveOptions, queryParams, queryKey]);

  const Collapsed = useCallback(() => {
    if (RenderInWrap) {
      return (
        <Box horizontal flexWrap="wrap">
          {values.map(opt => (
            <Box key={opt.value} m={2}>
              <RenderInWrap data={opt} />
            </Box>
          ))}
        </Box>
      );
    }
    return <Text>{values.map(s => s.label).join(", ")}</Text>;
  }, [values, RenderInWrap]);

  const components = useMemo(() => {
    const components = {};
    if (RenderInWrap) {
      Object.assign(components, { MultiValueLabel: RenderInWrap });
    }
    return components;
  }, [RenderInWrap]);

  const handleChange = useCallback(
    (opt: Option[] | Option) => {
      if ((single && !opt) || (!single && !opt.length)) {
        updateQueryParams(queryKey, null);
        return;
      }
      if (single && opt.value) {
        updateQueryParams(queryKey, opt.value);
      } else if (Array.isArray(opt)) {
        updateQueryParams(queryKey, opt.map(o => o.value));
      }
    },
    [updateQueryParams, queryKey, single],
  );

  const isActive = !!values.length;

  return (
    <WrappableField
      width={300}
      label={title}
      isActive={isActive}
      RenderCollapsed={Collapsed}
    >
      <Select
        {...props}
        isMulti={!single}
        autoFocus
        openMenuOnFocus
        placeholder={placeholder}
        isClearable
        value={single ? (values.length ? values[0] : null) : values}
        options={options}
        onChange={handleChange}
        components={components}
      />
    </WrappableField>
  );
}
