// @flow

import React from "react";
import { FaRegFileAlt } from "react-icons/fa";

import {
  ActionableStop,
  EditableStop,
  useReadOnly,
} from "components/base/Timeline";
import type { Whitelist } from "data/types";
import Badge from "./Badge";
import WhitelistParameters from "./WhitelistParameters";
import type { RuleWhitelist } from "./types";

const emptyRule = {
  type: "WHITELIST",
  data: [],
};

type Props = {
  onRemove: () => void,
  whitelists: Whitelist[],
  onAdd: RuleWhitelist => void,
  onEdit: RuleWhitelist => void,
  rule: ?RuleWhitelist,
};

const WhitelistStop = ({
  onRemove,
  onAdd,
  whitelists,
  onEdit,
  rule,
}: Props) => {
  const readOnly = useReadOnly();

  if (readOnly && !rule) return null;

  const stopProps = {
    bulletSize: "small",
    bar: "full",
    pb: readOnly ? 0 : 30,
  };

  if (!rule) {
    return (
      <ActionableStop
        {...stopProps}
        isValid={isRuleValid}
        extraProps={{ whitelists }}
        label="Add whitelist"
        desc="The transaction can be sent to recipients who belong to specific whitelists"
        initialValue={emptyRule}
        EditComponent={EditWhitelist}
        onSubmit={onAdd}
      />
    );
  }

  return (
    <EditableStop
      {...stopProps}
      value={rule}
      extraProps={{ whitelists }}
      bulletVariant="plain"
      label="Edit whitelist"
      Icon={FaRegFileAlt}
      isValid={isRuleValid}
      EditComponent={EditWhitelist}
      DisplayComponent={DisplayWhitelist}
      onRemove={onRemove}
      onSubmit={onEdit}
    />
  );
};

/* eslint-disable no-unused-vars */
const isRuleValid = (rule: RuleWhitelist) => {
  /* eslint-enable no-unused-vars */
  return true;
  // return rule.data.length > 0;
};

const DisplayWhitelist = (props: {
  value: RuleWhitelist,
  extraProps?: {
    whitelists: Whitelist[],
  },
}) => (
  <div style={{ lineHeight: 2.5 }}>
    <div>
      <strong>Whitelist</strong>
      {" - Allowed recipients:"}
    </div>
    {props.value.data.map(v => {
      if (!props.extraProps) return;
      const { whitelists } = props.extraProps;
      const whitelist = whitelists.find(w => w.id === v);
      if (!whitelist) return;
      return (
        <Badge
          Icon={FaRegFileAlt}
          key={whitelist.id}
          style={{ marginRight: 5 }}
        >
          {whitelist.name}
        </Badge>
      );
    })}
  </div>
);

const EditWhitelist = ({
  value,
  onChange,
  extraProps,
}: {
  value: RuleWhitelist,
  onChange: RuleWhitelist => void,
  extraProps?: {
    whitelists: Whitelist[],
  },
}) =>
  extraProps ? (
    <WhitelistParameters
      rule={value}
      onChange={onChange}
      whitelists={extraProps && extraProps.whitelists}
    />
  ) : null;

export default WhitelistStop;
