// @flow

import React from "react";
import { BigNumber } from "bignumber.js";
import { FaArrowsAltH } from "react-icons/fa";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";

import CurrencyUnitValue from "components/CurrencyUnitValue";
import {
  ActionableStop,
  EditableStop,
  useReadOnly,
} from "components/base/Timeline";
import Badge from "./Badge";
import ThresholdParameters from "./ThresholdParameters";
import type { RuleThreshold } from "./types";

const FIXME_FORCE_CURRENCY = getCryptoCurrencyById("bitcoin");

const emptyRule = {
  type: "THRESHOLD",
  data: [
    {
      min: BigNumber(0),
      max: BigNumber(0),
    },
  ],
};

type Props = {
  rule: ?RuleThreshold,
  onAdd: RuleThreshold => void,
  onEdit: RuleThreshold => void,
  onRemove: () => void,
};

const ThresholdStop = ({ rule, onRemove, onAdd, onEdit }: Props) => {
  const readOnly = useReadOnly();

  if (!rule && readOnly) return null;

  const stopProps = {
    bulletSize: "small",
    bar: "full",
    pt: readOnly ? 0 : 30,
  };

  if (!rule) {
    return (
      <ActionableStop
        {...stopProps}
        isValid={isRuleValid}
        label="Add amount range"
        desc="This rule applies to transactions between two amounts"
        initialValue={emptyRule}
        EditComponent={EditThreshold}
        onSubmit={onAdd}
      />
    );
  }

  const threshold = rule.data[0];

  if (!threshold) {
    throw new Error("No condition in threshold rule");
  }

  return (
    <EditableStop
      {...stopProps}
      value={rule}
      bulletVariant="plain"
      label="Edit threshold"
      isValid={isRuleValid}
      Icon={FaArrowsAltH}
      EditComponent={EditThreshold}
      DisplayComponent={DisplayThreshold}
      onRemove={onRemove}
      onSubmit={onEdit}
    />
  );
};

const DisplayThreshold = ({ value }: { value: RuleThreshold }) => {
  const threshold = value.data[0];
  if (!threshold) {
    return "Invalid threshold";
  }
  return (
    <div>
      <div>
        <strong>Amount range</strong>
      </div>
      <span>
        {"Applies to transactions between "}
        <Badge>
          <strong>
            <CurrencyUnitValue
              unit={FIXME_FORCE_CURRENCY.units[0]}
              value={threshold.min}
            />
          </strong>
        </Badge>
        {" and "}
        <Badge>
          <strong>
            <CurrencyUnitValue
              unit={FIXME_FORCE_CURRENCY.units[0]}
              value={threshold.max}
            />
          </strong>
        </Badge>
      </span>
    </div>
  );
};

const EditThreshold = ({
  value,
  onChange,
}: {
  value: RuleThreshold,
  onChange: RuleThreshold => void,
}) => <ThresholdParameters rule={value} onChange={onChange} />;

function isRuleValid(rule: RuleThreshold) {
  const threshold = rule.data[0];
  if (!threshold) return false;
  return (
    !!threshold.min &&
    !!threshold.max &&
    !threshold.min.isEqualTo(threshold.max) &&
    threshold.max.isGreaterThan(threshold.min) &&
    threshold.min.isGreaterThanOrEqualTo(0) &&
    threshold.max.isGreaterThanOrEqualTo(0)
  );
}

export default ThresholdStop;
