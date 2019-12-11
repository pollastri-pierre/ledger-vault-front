// @flow

import React from "react";
import { BigNumber } from "bignumber.js";
import { FaArrowsAltH } from "react-icons/fa";

import CurrencyUnitValue from "components/CurrencyUnitValue";
import {
  ActionableStop,
  EditableStop,
  useReadOnly,
} from "components/base/Timeline";
import {
  currencyOrNull,
  tokenOrNull,
  getCurrencyLikeUnit,
} from "utils/cryptoCurrencies";
import type { CurrencyOrToken } from "data/types";
import Badge from "./Badge";
import ThresholdParameters from "./ThresholdParameters";
import type { RuleThreshold } from "./types";

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
  currencyOrToken: CurrencyOrToken,
};

const ThresholdStop = ({
  rule,
  currencyOrToken,
  onRemove,
  onAdd,
  onEdit,
}: Props) => {
  const readOnly = useReadOnly();

  if (!rule && readOnly) return null;

  const stopProps = {
    bulletSize: "small",
    bar: "full",
    pt: readOnly ? 0 : 30,
  };

  const extraProps = {
    currencyOrToken,
  };

  if (!rule) {
    return (
      <ActionableStop
        {...stopProps}
        extraProps={extraProps}
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
      extraProps={extraProps}
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

type ExtraProps = {
  currencyOrToken: CurrencyOrToken,
};

const DisplayThreshold = ({
  value,
  extraProps,
}: {
  value: RuleThreshold,
  extraProps?: ExtraProps,
}) => {
  const threshold = value.data[0];
  if (!threshold) {
    return "Invalid threshold";
  }
  if (!extraProps) return null;
  const { currencyOrToken } = extraProps;

  const currency = currencyOrNull(currencyOrToken);
  const token = tokenOrNull(currencyOrToken);
  const unit = currency ? currency.units[0] : getCurrencyLikeUnit(token);

  return (
    <div>
      <div>
        <strong>Amount range</strong>
      </div>
      <div style={{ lineHeight: 2.5 }}>
        {threshold.max ? (
          <span>
            {"Applies to transactions with amount between "}
            <Badge>
              <strong>
                <CurrencyUnitValue unit={unit} value={threshold.min} />
              </strong>
            </Badge>
            {" and "}
            <Badge>
              <strong>
                <CurrencyUnitValue unit={unit} value={threshold.max} />
              </strong>
            </Badge>
          </span>
        ) : (
          <span>
            {"Applies to transactions with amount greater than "}
            <Badge>
              <strong>
                <CurrencyUnitValue unit={unit} value={threshold.min} />
              </strong>
            </Badge>
          </span>
        )}
      </div>
    </div>
  );
};

const EditThreshold = ({
  value,
  onChange,
  extraProps,
}: {
  value: RuleThreshold,
  onChange: RuleThreshold => void,
  extraProps?: ExtraProps,
}) => {
  if (!extraProps) return null;
  return (
    <ThresholdParameters
      rule={value}
      currencyOrToken={extraProps.currencyOrToken}
      onChange={onChange}
    />
  );
};

function isRuleValid(rule: RuleThreshold) {
  const threshold = rule.data[0];
  if (!threshold) return false;
  return (
    !!threshold.min &&
    threshold.min.isGreaterThanOrEqualTo(0) &&
    (threshold.max === null || threshold.max.isGreaterThan(threshold.min))
  );
}

export default ThresholdStop;
