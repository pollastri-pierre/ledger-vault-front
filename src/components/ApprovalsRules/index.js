// @flow

import React, { PureComponent } from "react";
import { Trans } from "react-i18next";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import { FaPlus } from "react-icons/fa";
import { SortableContainer, arrayMove } from "react-sortable-hoc";

import type { User, Group } from "data/types";

import Box from "components/base/Box";
import Text from "components/base/Text";
import Rule from "./ApprovalsRule";
import StepBall from "./StepBall";

export type ApprovalsRule = {
  quorum: number,
  users: number[],
  group_id: number | null,
};

export type ApprovalsSelectedIds = {
  groups: number[],
  users: number[],
};

type Props = {
  // set & get approvals rules
  rules: ApprovalsRule[],
  onChange: (ApprovalsRule[]) => void,

  // used to fill select
  users: User[],
  groups: Group[],

  // maximum number of rules that one can add
  maxRules: number,
};

class ApprovalsRules extends PureComponent<Props> {
  static defaultProps = {
    maxRules: 4,
  };

  canAddApproval = () => {
    const { rules, maxRules } = this.props;
    if (!rules.length) return true;
    if (rules.length >= maxRules) return false;
    return !isRuleInvalid(rules[rules.length - 1]);
  };

  addEmptyRule = () => {
    const { onChange, rules } = this.props;
    const rule = { quorum: 1, users: [], group_id: null };
    onChange([...rules, rule]);
  };

  handleSortEnd = ({
    oldIndex,
    newIndex,
  }: {
    oldIndex: number,
    newIndex: number,
  }) => {
    const { rules, onChange } = this.props;
    const reordered = arrayMove([...rules], oldIndex, newIndex);
    onChange(reordered);
  };

  Rule = (rule: ApprovalsRule, i: number) => {
    const { users, groups, rules, onChange } = this.props;
    const handleChange = newRule => {
      const newRules = [...rules];
      newRules.splice(rules.indexOf(rule), 1, newRule);
      onChange(newRules);
    };
    const handleRemove = () => {
      const newRules = [...rules];
      newRules.splice(i, 1);
      onChange(newRules);
    };
    return (
      <Rule
        key={i}
        index={i}
        rule={rule}
        users={users}
        groups={groups}
        onChange={handleChange}
        onRemove={rules.length > 1 ? handleRemove : undefined}
        parentSelectedIds={this.selectedIds}
      />
    );
  };

  selectedIds: ApprovalsSelectedIds = {
    groups: [],
    users: [],
  };

  render() {
    const { rules, maxRules } = this.props;

    // used to filter options in cascade
    // put in `this` to retrieve it in this.Rule
    this.selectedIds = collectSelectedIds(rules);

    const rulesList = (
      <RulesContainer
        useDragHandle
        lockToContainerEdges
        lockAxis="y"
        onSortEnd={this.handleSortEnd}
      >
        {rules.map(this.Rule)}
      </RulesContainer>
    );

    const footer = (
      <Box horizontal justify="flex-end" style={styles.footer}>
        {rules.length < maxRules && (
          <AddButton
            onClick={this.addEmptyRule}
            disabled={!this.canAddApproval()}
          />
        )}
      </Box>
    );

    return (
      <Box horizontal style={styles.container}>
        {stepsLine}
        <Box grow pt={50}>
          {rulesList}
          {footer}
        </Box>
      </Box>
    );
  }
}

const styles = {
  container: {
    maxWidth: 600,
  },
  stepsLine: {
    width: 30,
  },
  footer: {
    height: 40,
  },
};

const RulesContainer = SortableContainer(
  ({ children }: { children: React$Node }) => <Box>{children}</Box>,
);

// TODO: we should have our own brand new Button component
const AddButtonComponent = styled(Button).attrs({
  color: "primary",
})`
  && {
    padding: 10px;
    min-height: 0;
    font-size: 11px;
    // background-color: rgba(245, 0, 87, 0.05);
    &:hover {
      // background-color: rgba(245, 0, 87, 0.08);
    }

    svg {
      margin-right: 5px;
    }
  }
`;

const Bar = styled.div`
  position: absolute;
  top: 20px;
  bottom: 20px;
  left: 10px;
  width: 4px;
  background: #eee;
  transform: translateX(-2px);
`;

const StepBallLabel = styled.div`
  position: absolute;
  left: 0;
  top: ${p => (p.top ? "10px" : "unset")};
  bottom: ${p => (p.bot ? "10px" : "unset")};
  color: #aaa;
  user-select: none;

  // sounds hacky. but does the job, used to place the label.
  > div:nth-child(2) {
    position: absolute;
    top: 0;
    left: 30px;
    white-space: nowrap;
  }
`;

const AddButton = props => (
  <AddButtonComponent {...props}>
    <FaPlus />
    <Trans i18nKey="approvalsRules:addApproval" />
  </AddButtonComponent>
);

const stepsLine = (
  <Box style={styles.stepsLine} noShrink position="relative">
    <Bar />
    <StepBallLabel top>
      <StepBall />
      <Text small uppercase i18nKey="approvalsRules:firstStepLabel" />
    </StepBallLabel>
    <StepBallLabel bot>
      <StepBall />
      <Text small uppercase i18nKey="approvalsRules:lastStepLabel" />
    </StepBallLabel>
  </Box>
);

const isRuleInvalid = (rule: ApprovalsRule) => {
  const hasQuorum = rule.quorum > 0;
  const hasUsersOrGroup = rule.users.length > 0 || rule.group_id !== null;
  return !hasQuorum || !hasUsersOrGroup;
};

const collectSelectedIds = (rules: ApprovalsRule[]) => ({
  groups: rules.reduce((acc, rule) => {
    if (rule.group_id) {
      acc.push(rule.group_id);
    }
    return acc;
  }, []),
  users: rules.reduce((acc, rule) => {
    if (rule.users.length) {
      acc = [...acc, ...rule.users];
    }
    return acc;
  }, []),
});

export default ApprovalsRules;
