// @flow

// TODO: put back when we use real ids
/* eslint-disable react/no-array-index-key */

import React from "react";
import { FaGripVertical } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import { MdClear } from "react-icons/md";
import styled from "styled-components";
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from "react-sortable-hoc";

import colors, { darken } from "shared/colors";
import Box from "components/base/Box";
import Button from "components/base/Button";
import Text from "components/base/Text";
import { getRulesSetErrors, isEmptyRulesSet } from "./helpers";

import type { RulesSet as RulesSetType } from "./types";

type MoveHandler = ({ oldIndex: number, newIndex: number }) => void;

type Props = {|
  rulesSets: RulesSetType[],
  activeIndex: number,
  onChangeIndex: number => void,
  canAdd: boolean,
  onAdd: () => void,
  onRemove: number => void,
  onMove: MoveHandler,
  readOnly?: boolean,
|};

const MultiRulesSideBar = (props: Props) => {
  const {
    rulesSets,
    activeIndex,
    onChangeIndex,
    canAdd,
    onAdd,
    onRemove,
    onMove,
    readOnly,
  } = props;
  const hasMultiple = rulesSets.length > 1;
  return (
    <MultiRulesSidebarContainer
      lockToContainerEdges
      lockOffset={0}
      useDragHandle
      axis="x"
      lockAxis="x"
      onSortEnd={onMove}
    >
      {rulesSets.map((rulesSet, i) => (
        <RulesSetTab
          key={i}
          index={i}
          onSelect={() => onChangeIndex(i)}
          rulesSet={rulesSet}
          error={
            getRulesSetErrors(rulesSet).length > 0 && !isEmptyRulesSet(rulesSet)
          }
          isActive={i === activeIndex}
          isLast={i === rulesSets.length - 1}
          isFirst={i === 0}
          onRemove={hasMultiple ? () => onRemove(i) : undefined}
          onMove={hasMultiple ? onMove : undefined}
          readOnly={readOnly}
        />
      ))}
      {canAdd && !readOnly && (
        <Box ml={10} mt={10}>
          <Button
            type="link"
            variant="primary"
            onClick={onAdd}
            style={{ padding: "0 10px" }}
          >
            <Box horizontal align="center" flow={5}>
              <FiPlus />
              <span>Add rule</span>
            </Box>
          </Button>
        </Box>
      )}
    </MultiRulesSidebarContainer>
  );
};

const MultiRulesSidebarContainer = SortableContainer(({ children }) => (
  <Box horizontal>{children}</Box>
));

type TabProps = {
  rulesSet: RulesSetType,
  onSelect: () => void,
  isActive: boolean,
  isLast: boolean,
  isFirst: boolean,
  error: Boolean,
  onRemove?: () => void,
  onMove?: MoveHandler,
  readOnly?: boolean,
};

const RulesSetTab = SortableElement(
  ({
    rulesSet,
    onSelect,
    isActive,
    isLast,
    error,
    isFirst,
    onRemove,
    onMove,
    readOnly,
  }: TabProps) => {
    const handleRemove = e => {
      e.stopPropagation();
      onRemove && onRemove();
    };
    return (
      <RulesSetTabContainer
        onClick={onSelect}
        isActive={isActive}
        isLast={isLast}
        isFirst={isFirst}
      >
        {!isLast && <Triangle isActive={isActive} />}
        {!readOnly && (
          <GripAction
            cursor="grab"
            pos="left"
            isVisible={!!onMove}
            onMouseUp={onSelect}
          >
            <FaGripVertical />
          </GripAction>
        )}
        <RuleTitle error={error}>{rulesSet.name}</RuleTitle>
        {!readOnly && (
          <Action
            pos="right"
            isVisible={!!onRemove}
            onClick={handleRemove}
            type="danger"
          >
            <MdClear />
          </Action>
        )}
      </RulesSetTabContainer>
    );
  },
);

const RuleTitle = styled(Text).attrs({
  fontWeight: "bold",
})`
  border-bottom: ${p => (p.error ? "1px dotted" : "none")}
  border-color: ${colors.grenade}
`;

const Triangle = styled.div`
  z-index: 2;
  position: absolute;
  top: 0;
  right: -15px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 30px 0 30px 15px;
  border-color: transparent transparent transparent ${colors.form.border};
  &:before {
    z-index: 1;
    content: "";
    position: absolute;
    top: -30px;
    right: 1px;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 30px 0 30px 15px;
    border-color: transparent transparent transparent
      ${p => (p.isActive ? "white" : colors.form.bg)};
  }
`;

const RulesSetTabContainer = styled.div`
  position: relative;
  width: 150px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ isActive }) => (isActive ? "white" : colors.form.bg)};
  border-style: solid;
  border-color: ${colors.form.border};
  border-width: 0;
  border-top-width: 1px;
  border-right-width: ${({ isLast }) => (isLast ? 1 : 0)}px;
  border-left-width: 1px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ isActive }) =>
    isActive ? "white" : colors.form.border};
  margin-bottom: -1px;
  position: relative;
  border-top-left-radius: ${({ isFirst }) => (isFirst ? 4 : 0)}px;
  border-top-right-radius: ${({ isLast }) => (isLast ? 4 : 0)}px;

  ${p =>
    !p.isActive
      ? `
  &:hover {
    cursor: pointer;
    background: ${darken(colors.form.bg, 0.02)};
    ${Triangle}:before {
      border-color: transparent transparent transparent ${darken(
        colors.form.bg,
        0.02,
      )};
    }
  }

  &:active {
    background: ${darken(colors.form.bg, 0.04)};
    ${Triangle}:before {
      border-color: transparent transparent transparent ${darken(
        colors.form.bg,
        0.04,
      )};
    }
  }
  `
      : ``}
`;

const Action = styled.div.attrs({ tabIndex: 0 })`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  cursor: ${p => p.cursor || "pointer"};
  outline: none;
  margin-left: ${p => (p.pos === "right" ? 15 : 0)}px;
  margin-right: ${p => (p.pos === "left" ? 5 : 0)}px;
  &:hover {
    opacity: 0.8;
    color: ${p => (p.type === "danger" ? colors.grenade : "inherit")};
  }
  &:active {
    opacity: 1;
    transform: scale(0.9);
  }

  transform: translateX(
    ${p => (p.isVisible ? 0 : p.pos === "left" ? -5 : 5)}px
  );
  opacity: ${p => (p.isVisible ? 0.5 : 0)};
  pointer-events: ${p => (p.isVisible ? "auto" : "none")};
  transition: 100ms ease-out;
  transition-property: transform opacity;
`;

const GripAction = SortableHandle(Action);

export default MultiRulesSideBar;
