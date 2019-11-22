// @flow

import React, { useState } from "react";
import styled from "styled-components";
import arrayMove from "array-move";

import colors from "shared/colors";
import Box from "components/base/Box";
import type { User, Group, Whitelist, CurrencyOrToken } from "data/types";
import RulesSet from "./RulesSet";
import MultiRulesSideBar from "./MultiRulesSideBar";
import { isValidRulesSet } from "./helpers";
import type { RulesSet as RulesSetType } from "./types";
import MultiTextMode from "./MultiTextMode";

const MAX_NB_RULES_SETS = 4;

type Props = {|
  rulesSets: RulesSetType[],
  onChange: (RulesSetType[]) => void,
  users: User[],
  groups: Group[],
  whitelists: Whitelist[],
  currencyOrToken: CurrencyOrToken,
  readOnly?: boolean,
  textMode?: boolean,
|};

const MultiRules = (props: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const {
    rulesSets: originalRulesSets,
    onChange,
    users,
    groups,
    whitelists,
    readOnly,
    textMode,
    currencyOrToken,
  } = props;
  const rulesSets = readOnly
    ? originalRulesSets.filter(isValidRulesSet)
    : originalRulesSets;

  if (!rulesSets.length) {
    return <Box>No valid rules set found.</Box>;
  }
  if (textMode) {
    return (
      <MultiTextMode
        rulesSets={rulesSets}
        users={users}
        groups={groups}
        whitelists={whitelists}
        currencyOrToken={currencyOrToken}
      />
    );
  }
  const handleChangeRulesSet = i => ruleSet =>
    onChange(rulesSets.map((s, j) => (i === j ? ruleSet : s)));

  const handleRemove = i => {
    const newSets = renameSets(rulesSets.filter((_, j) => j !== i));
    const newIndex =
      i === activeIndex
        ? i === 0
          ? 0
          : i - 1
        : i > activeIndex
        ? activeIndex
        : activeIndex - 1;
    setActiveIndex(newIndex);
    onChange(newSets);
  };

  const handleAdd = () => {
    onChange(
      renameSets([
        ...rulesSets,
        {
          name: "",
          rules: [
            {
              type: "MULTI_AUTHORIZATIONS",
              data: [],
            },
          ],
        },
      ]),
    );
    setActiveIndex(rulesSets.length);
  };

  const handleMove = ({ oldIndex, newIndex }) => {
    const newRulesSets = arrayMove(rulesSets, oldIndex, newIndex);
    const newActiveIndex = findNewActiveIndex(
      rulesSets,
      activeIndex,
      oldIndex,
      newIndex,
    );
    onChange(renameSets(newRulesSets));
    if (newActiveIndex !== activeIndex) {
      setActiveIndex(newActiveIndex);
    }
  };

  const canAdd = rulesSets.length < MAX_NB_RULES_SETS;

  const safeActiveIndex = rulesSets[activeIndex] ? activeIndex : 0;
  const rulesSet = rulesSets[safeActiveIndex];

  if (!rulesSet) {
    return null;
  }

  return (
    <Box width={600}>
      <MultiRulesSideBar
        rulesSets={rulesSets}
        activeIndex={safeActiveIndex}
        onChangeIndex={setActiveIndex}
        onAdd={handleAdd}
        canAdd={canAdd}
        onRemove={handleRemove}
        onMove={handleMove}
        readOnly={readOnly}
      />
      <RulesSetContainer isFull={rulesSets.length === MAX_NB_RULES_SETS}>
        <RulesSet
          key={rulesSet.name}
          currencyOrToken={currencyOrToken}
          rulesSet={rulesSet}
          onChange={handleChangeRulesSet(safeActiveIndex)}
          users={users}
          groups={groups}
          whitelists={whitelists}
          readOnly={readOnly}
        />
      </RulesSetContainer>
    </Box>
  );
};

const RulesSetContainer = styled(Box).attrs({})`
  flex-grow: 1;
  border-radius: 4px;
  border-top-left-radius: 0;
  border-top-right-radius: ${p => (p.isFull ? 0 : 4)}px;
  border: 1px solid ${colors.form.border};
  padding: 16px;
  background: white;
`;

function renameSets(sets) {
  return sets.map((s, i) => ({
    ...s,
    name: `Rule ${i + 1}`,
  }));
}

function findNewActiveIndex(arr, activeIndex, oldIndex, newIndex) {
  const before = arr.map((e, i) => i === activeIndex);
  const after = arrayMove(before, oldIndex, newIndex);
  const i = after.findIndex(e => e);
  return i;
}

MultiRules.defaultProps = {
  users: [],
  groups: [],
  whitelists: [],
  onChange: () => {},
};
export default MultiRules;
