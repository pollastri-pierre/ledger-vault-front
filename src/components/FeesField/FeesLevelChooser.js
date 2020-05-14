// @flow

import React from "react";
import styled from "styled-components";

import colors from "shared/colors";
import FeesLevelIcon from "components/icons/FeesLevel";
import Box from "components/base/Box";

import type { FeesLevelPredefined } from "bridge/fees.types";

type FeesLevelOption = {| value: FeesLevelPredefined, label: string |};

const FEES_LEVEL_OPTIONS: FeesLevelOption[] = [
  { value: "slow", label: "Slow" },
  { value: "normal", label: "Medium" },
  { value: "fast", label: "Fast" },
];

type Props = {|
  value: FeesLevelPredefined,
  onChange: FeesLevelPredefined => void,
|};

const FeesLevelChooser = ({ value, onChange }: Props) => (
  <Box horizontal flow={20}>
    {FEES_LEVEL_OPTIONS.map(s => (
      <Option
        key={s.value}
        isSelected={s.value === value}
        label={s.label}
        value={s.value}
        onClick={onChange}
      />
    ))}
  </Box>
);

type LevelOptionProps = {
  isSelected: boolean,
  label: string,
  value: FeesLevelPredefined,
  onClick: FeesLevelPredefined => void,
};

const Option = ({ isSelected, label, value, onClick }: LevelOptionProps) => (
  <OptionContainer isSelected={isSelected} onClick={() => onClick(value)}>
    <FeesLevelIcon level={value} size={24} />
    <span>{label}</span>
  </OptionContainer>
);

const OptionContainer = styled.div`
  flex: 1;
  border: 2px solid
    ${p => (p.isSelected ? colors.bLive : colors.legacyLightGrey2)};
  box-sizing: border-box;
  border-radius: 8px;
  height: 100px;
  cursor: ${p => (p.isSelected ? "default" : "pointer")};
  pointer-events: ${p => (p.isSelected ? "none" : "inherit")};
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: ${p => (p.isSelected ? colors.bLive : "inherit")};
  font-weight: 600;
  align-items: center;
  > * + * {
    margin-top: 8px;
  }
`;

export default FeesLevelChooser;
