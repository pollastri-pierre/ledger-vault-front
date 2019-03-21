// @flow

import React, { PureComponent } from "react";
import { Trans, translate } from "react-i18next";
import styled from "styled-components";
import { SortableHandle, SortableElement } from "react-sortable-hoc";
import { FaGripVertical, FaTrash } from "react-icons/fa";

import type { User, Group } from "data/types";

import colors from "shared/colors";
import Box from "components/base/Box";
import Text from "components/base/Text";
import InfoBox from "components/base/InfoBox";
import NumberChooser from "components/base/NumberChooser";
import SelectGroupsUsers from "components/SelectGroupsUsers";

import type {
  ApprovalsRule as ApprovalsRuleType,
  ApprovalsSelectedIds,
} from "./index";
import StepBall from "./StepBall";

type Props = {
  rule: ApprovalsRuleType,
  onChange: ApprovalsRuleType => void,
  onRemove: () => void,
  parentSelectedIds: ApprovalsSelectedIds,
  users: User[],
  groups: Group[],
  t: string => string,
};

type State = {
  hasBeenClosed: boolean,
};

const MAX_USERS = 20;

class ApprovalsRule extends PureComponent<Props, State> {
  state = {
    hasBeenClosed: false,
  };

  handleChangeQuorum = (quorum: number) => {
    this.props.onChange({ ...this.props.rule, quorum });
  };

  handleClose = () => {
    if (!this.state.hasBeenClosed) this.setState({ hasBeenClosed: true });
  };

  handleChangeSelect = ({
    groups,
    members: users,
  }: {
    groups: Group[],
    members: User[],
  }) => {
    const { rule, onChange } = this.props;

    const justAddedGroup = !rule.group && !!groups.length;
    const justAddedUser = rule.users.length !== users.length;

    const newRule = {
      ...rule,
      group: justAddedUser
        ? null
        : groups.length
        ? groups[groups.length - 1].id
        : null,
      users: justAddedGroup ? [] : users.map(u => u.id).slice(0, MAX_USERS),
    };

    // ensure quorum > groups length, etc.
    if (newRule.group) {
      const group = groups.find(g => g.id === newRule.group);
      if (group && newRule.quorum > group.members.length) {
        newRule.quorum = group.members.length;
      }
    } else if (newRule.users.length && newRule.quorum > newRule.users.length) {
      newRule.quorum = newRule.users.length;
    } else {
      newRule.quorum = 1;
    }

    onChange(newRule);
  };

  render() {
    const { rule, users, groups, onRemove, parentSelectedIds, t } = this.props;
    const { hasBeenClosed } = this.state;
    const { group: ruleGroup, users: ruleUsers } = rule;

    const group = ruleGroup ? groups.find(g => g.id === ruleGroup) : null;
    const max = group ? group.members.length : ruleUsers.length || 1;
    const nbSelected = group ? group.members.length : ruleUsers.length;

    const filteredGroups = groups.filter(g => {
      if (g.id === ruleGroup) return true;
      if (parentSelectedIds.groups.indexOf(g.id) === -1) return true;
      return false;
    });

    const filteredUsers = users.filter(u => {
      if (rule.users.indexOf(u.id) !== -1) return true;
      if (parentSelectedIds.users.indexOf(u.id) === -1) return true;
      return false;
    });

    const isInvalid = hasBeenClosed && nbSelected === 0;

    return (
      <div style={styles.paddedBotForDrag}>
        <RuleContainer isInvalid={isInvalid}>
          <Box horizontal position="relative" align="flex-start">
            {grip}
            {stepBall}
            <NumberChooser
              style={styles.fixedHeight}
              value={rule.quorum}
              onChange={this.handleChangeQuorum}
              min={1}
              max={max}
            />
            {approvalsFrom}
            <Box grow py={10} pr={10} justify="center">
              <SelectGroupsUsers
                onMenuClose={this.handleClose}
                placeholder={t("approvalsRules:selectPlaceholder")}
                autoFocus={nbSelected === 0}
                openMenuOnFocus
                groups={filteredGroups}
                members={filteredUsers}
                value={resolveSelectValue(rule, groups, users)}
                onChange={this.handleChangeSelect}
              />
            </Box>
            {onRemove && (
              <RemoveContainer onClick={onRemove}>{iconTrash}</RemoveContainer>
            )}
          </Box>
          {!!nbSelected && <NbOfUsers nb={nbSelected} isGroup={!!group} />}
          {isInvalid && (
            <ErrorContainer>
              <InfoBox type="warning">
                <Text i18nKey="approvalsRules:invalidRule" />
              </InfoBox>
            </ErrorContainer>
          )}
        </RuleContainer>
      </div>
    );
  }
}

const styles = {
  fixedHeight: {
    height: 60,
  },
  paddedBotForDrag: {
    paddingBottom: 10,
  },
  grip: {
    cursor: "ns-resize",
  },
  nbOfUsers: {
    alignSelf: "flex-end",
  },
};

const ErrorContainer = styled(Box).attrs({
  p: 10,
  pl: 40,
  pt: 0,
})``;

const RuleContainer = styled(Box).attrs({
  bg: "white",
})`
  border: 1px solid;
  border-color: ${p => (p.isInvalid ? colors.blue_orange : " #eee")}
  border-radius: 3px;
  user-select: none;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.05);
`;

const Grip = SortableHandle(styled(Box).attrs({
  align: "center",
  justify: "center",
  noShrink: true,
})`
  height: 60px;
  width: 40px;
  cursor: ns-resize;
  color: #eee;
  transition: 50ms linear color;
`);

const StepBallContainer = styled.div`
  position: absolute;
  top: 20px;
  left: -21px; //yep
  display: flex;
  align-items: center;
  ${StepBall} {
    transform: translateX(-50%);
  }
`;

const RemoveContainer = styled(Box).attrs({
  align: "center",
  justify: "center",
})`
  position: absolute;
  color: #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 40px;
  height: 40px;
  top: 50%;
  left: 100%;
  transform: translateY(-50%);

  &:hover {
    color: #aaa;
  }

  &:active {
    color: #888;
  }
`;

const NbOfUsers = ({ nb, isGroup }: { nb: number, isGroup: boolean }) => (
  <Box style={styles.nbOfUsers} p={10} pt={0}>
    <Text small color="#aaa">
      <Trans
        i18nKey={
          isGroup
            ? "approvalsRules:approvalsFromNbGroup"
            : "approvalsRules:approvalsFromNb"
        }
        count={nb}
        values={{ nb }}
      />
    </Text>
  </Box>
);

const iconTrash = <FaTrash size={12} />;

const grip = (
  <Grip>
    <FaGripVertical />
  </Grip>
);

const stepBall = (
  <StepBallContainer>
    <StepBall />
  </StepBallContainer>
);

const approvalsFrom = (
  <Box
    align="center"
    justify="center"
    noShrink
    px={10}
    style={styles.fixedHeight}
  >
    <Text
      lineHeight={0}
      small
      color="#555"
      i18nKey="approvalsRules:approvalsFrom"
    />
  </Box>
);

function resolveSelectValue(
  rule: ApprovalsRuleType,
  groups: Group[],
  users: User[],
) {
  const groupInGroups = rule.group && groups.find(g => g.id === rule.group);
  return {
    groups: groupInGroups ? [groupInGroups] : [],
    members: users.filter(u => rule.users.indexOf(u.id) !== -1),
  };
}

export default SortableElement(translate()(ApprovalsRule));
