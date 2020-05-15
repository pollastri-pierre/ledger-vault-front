// @flow

import React, { useCallback, useMemo } from "react";
import type { ObjectParameter } from "query-string";
import { components as reactSelectComponents } from "react-select";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import type { OptionProps } from "react-select/src/types";

import { WrappableField } from "components/filters";
import Select from "components/base/Select";
import Box from "components/base/Box";

import type { FieldProps } from "components/filters";

type Option = {
  value: string,
  label: React$Node,
  data: *,
};

type Props = FieldProps & {
  placeholder: string,
  options: Option[],
  title: string,
  single: boolean,
  width?: number,
  RenderInWrap: React$ComponentType<*>,
  withCheckboxes: boolean,
};

const iconChecked = <MdCheckBox />;
const iconUnchecked = <MdCheckBoxOutlineBlank />;

const CheckBoxOption = (props: OptionProps) => (
  <reactSelectComponents.Option {...props}>
    <Box horizontal align="center" flow={10}>
      {props.isSelected ? iconChecked : iconUnchecked}
      <span>{props.label}</span>
    </Box>
  </reactSelectComponents.Option>
);

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
    withCheckboxes,
    width,
  } = props;

  const resolveOptions = useCallback(
    (arr: $ReadOnlyArray<ObjectParameter>): Option[] => {
      return arr
        .map((s) => {
          // handle both "simple" and "with sections" forms
          for (const o of options) {
            if (!("value" in o) && "options" in o) {
              for (const subO of o.options) {
                if (areSame(subO.value, s)) return subO;
              }
            }
            if (o.value && areSame(o.value, s)) return o;
          }
          return null;
        })
        .filter(Boolean);
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
          {values.map((opt) => (
            <Box key={opt.value} m={2}>
              <RenderInWrap data={opt} />
            </Box>
          ))}
        </Box>
      );
    }
    return <Box ellipsis>{values.map((s) => s.label).join(", ")}</Box>;
  }, [values, RenderInWrap]);

  const components = useMemo(() => {
    const components = {};
    if (RenderInWrap) {
      Object.assign(components, { MultiValueLabel: RenderInWrap });
    }
    if (withCheckboxes) {
      Object.assign(components, { Option: CheckBoxOption });
    }
    return components;
  }, [RenderInWrap, withCheckboxes]);

  const handleChange = useCallback(
    (opt: Option[] | Option) => {
      if ((single && !opt) || (!single && (!opt || !opt.length))) {
        updateQueryParams(queryKey, null);
        return;
      }
      if (single && opt.value) {
        updateQueryParams(queryKey, opt.value);
      } else if (Array.isArray(opt)) {
        updateQueryParams(
          queryKey,
          opt.map((o) => o.value),
        );
      }
    },
    [updateQueryParams, queryKey, single],
  );

  const isActive = !!values.length;

  return (
    <WrappableField
      inPlace
      width={width || 300}
      label={title}
      isActive={isActive}
      RenderCollapsed={Collapsed}
    >
      {({ toggle }) => (
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
          onMenuClose={toggle}
          width={100}
        />
      )}
    </WrappableField>
  );
}

// in many cases we take stuff from url (so: as string) and we compare with
// numbers (e.g: ids). so this function just compare the string versions
// if possible
function areSame(v1: any, v2: any) {
  if (!v1.toString || !v2.toString) return v1 === v2;
  return v1.toString() === v2.toString();
}
