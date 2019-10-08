// @flow

import React from "react";
import { FaRegFileAlt } from "react-icons/fa";

import {
  ActionableStop,
  EditableStop,
  useReadOnly,
} from "components/base/Timeline";
import Badge from "./Badge";
import WhitelistParameters from "./WhitelistParameters";
import type { RuleWhitelist } from "./types";

const emptyRule = {
  type: "WHITELIST",
  data: [],
};

type Props = {
  onRemove: () => void,
  onAdd: RuleWhitelist => void,
  onEdit: RuleWhitelist => void,
  rule: ?RuleWhitelist,
};

const WhitelistStop = ({ onRemove, onAdd, onEdit, rule }: Props) => {
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

const DisplayWhitelist = () => (
  <div>
    <div>
      <strong>Whitelist</strong>
    </div>
    {"Allowed recipients: "}
    <Badge Icon={FaRegFileAlt}>
      <strong>Europe customers</strong>
    </Badge>
    {" whitelist(s)"}
  </div>
);

const EditWhitelist = ({
  value,
  onChange,
}: {
  value: RuleWhitelist,
  onChange: RuleWhitelist => void,
}) => <WhitelistParameters rule={value} onChange={onChange} />;

export default WhitelistStop;
