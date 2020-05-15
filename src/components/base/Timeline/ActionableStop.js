// @flow

import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";
import styled from "styled-components";

import colors from "shared/colors";
import { TimelineStop, useReadOnly } from "components/base/Timeline";
import type { RuleMultiAuth } from "components/MultiRules/types";
import { EditForm } from "./EditableStop";
import type { EditableComponent } from "./types";

type Props<T, P> = {
  label: React$Node,
  desc?: React$Node,
  EditComponent: EditableComponent<T, P>,
  extraProps?: P,
  onSubmit: (T) => void,
  onClick?: () => void,
  initialValue: T,
  isValid: (T, ?RuleMultiAuth) => boolean,
  isDisabled?: boolean,
  isMandatory?: boolean,
};

const ActionableStop = <T, P>({
  label,
  desc,
  EditComponent,
  extraProps,
  onSubmit,
  onClick,
  initialValue,
  isValid,
  isDisabled,
  isMandatory,
  ...props
}: Props<T, P>) => {
  const [isActive, setActive] = useState(false);
  const readOnly = useReadOnly();

  if (readOnly) return null;

  const handleSubmit = (v) => {
    setActive(false);
    onSubmit(v);
  };
  return (
    <TimelineStop
      dataType="close-bubbles"
      Icon={FiPlus}
      bulletVariant="interactive"
      onClick={isActive ? undefined : () => setActive(true)}
      isDisabled={isDisabled}
      {...props}
    >
      {isActive && (
        <EditForm
          onCancel={() => setActive(false)}
          onSubmit={handleSubmit}
          isValid={isValid}
          label={label}
          EditComponent={EditComponent}
          extraProps={extraProps}
          initialValue={initialValue}
        />
      )}
      <div>
        <Inner isDisabled={isDisabled} data-test="select_tx_rule">
          {label}
          {isMandatory && (
            <span
              style={{
                color: colors.grenade,
                marginLeft: 5,
                display: "inline-block",
              }}
            >
              *
            </span>
          )}
        </Inner>
        {desc}
      </div>
    </TimelineStop>
  );
};

const Inner = styled.div`
  color: ${(p) => (p.isDisabled ? colors.mediumGrey : colors.bLive)};
  font-weight: bold;
`;

export default ActionableStop;
