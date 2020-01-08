// @flow

import React, { Fragment } from "react";
import { FaUser, FaUsers, FaRegFileAlt, FaArrowsAltH } from "react-icons/fa";
import styled from "styled-components";

import Box from "components/base/Box";
import Text from "components/base/Text";
import NotApplicableText from "components/base/NotApplicableText";
import LineSeparator from "components/LineSeparator";
import CurrencyUnitValue from "components/CurrencyUnitValue";
import colors from "shared/colors";
import {
  currencyOrNull,
  tokenOrNull,
  getCurrencyLikeUnit,
} from "utils/cryptoCurrencies";
import type { User, Group, Whitelist, CurrencyOrToken } from "data/types";
import type { RulesSet as RulesSetType } from "./types";

import {
  getMultiAuthRule,
  getThresholdRule,
  getWhitelistRule,
} from "./helpers";

type MultiTextModeProps = {
  rulesSets: RulesSetType[],
  whitelists: Whitelist[],
  groups: Group[],
  users: User[],
  currencyOrToken: CurrencyOrToken,
};

function MultiTextMode(props: MultiTextModeProps) {
  const { rulesSets, whitelists, groups, users, currencyOrToken } = props;
  return (
    <Box>
      {rulesSets.map((rulesSet, i) => (
        <Fragment key={rulesSet.name}>
          <ResolveRuleSet
            rulesSet={rulesSet}
            whitelists={whitelists}
            groups={groups}
            users={users}
            currencyOrToken={currencyOrToken}
          />
          {rulesSets[i + 1] ? <LineSeparator /> : null}
        </Fragment>
      ))}
    </Box>
  );
}

export default MultiTextMode;

type ResolveRulesProps = {
  rulesSet: RulesSetType,
  whitelists: Whitelist[],
  groups: Group[],
  users: User[],
  currencyOrToken: CurrencyOrToken,
};

function ResolveRuleSet(props: ResolveRulesProps) {
  const { rulesSet, whitelists, users, groups, currencyOrToken } = props;
  const thresholdRule = getThresholdRule(rulesSet);
  const whitelistRule = getWhitelistRule(rulesSet);
  const multiAuthRule = getMultiAuthRule(rulesSet);
  const creatorStep = multiAuthRule && multiAuthRule.data[0];
  const threshold = thresholdRule && thresholdRule.data[0];
  const approvalSteps = multiAuthRule && multiAuthRule.data.slice(1);

  const currency = currencyOrNull(currencyOrToken);
  const token = tokenOrNull(currencyOrToken);
  const unit = currency ? currency.units[0] : getCurrencyLikeUnit(token);

  function resolveUsers(userList: Array<number | User>) {
    const usersFound = users.filter(user => {
      return userList.find(u => {
        if (typeof u === "number") {
          return user.id === u;
        }
        return user.id === u.id;
      });
    });
    return usersFound.map(u => (
      <StyledLi key={u.id}>
        <Box horizontal flow={5} align="center">
          <FaUser size={12} />
          <Text>{u.username}</Text>
        </Box>
      </StyledLi>
    ));
  }

  const resolveGroup = (groupId: number) => {
    const groupFound = groups.find(g => g.id === groupId);
    return (
      <StyledLi key={groupId}>
        <Box horizontal flow={5} align="center">
          <FaUsers />
          <Text inline>
            {groupFound ? groupFound.name : <NotApplicableText />}
          </Text>
        </Box>
      </StyledLi>
    );
  };
  // index is not used as a key iterator by choice but rather by no choice
  const resolveApproverOrCreator = (
    step: any,
    index: ?number,
    type?: string,
  ) => {
    if (step.group_id || (step.group && !step.group.is_internal)) {
      const groupId = step.group_id || step.group.id;
      if (type === "creator" && step.quorum < 2) {
        return <StyledUl key={index}>{resolveGroup(groupId)}</StyledUl>;
      }
      return (
        <StyledUl key={index}>
          <StyledLi>
            <Text
              i18nKey="approvalsRules:textMode.quorum"
              values={{ nb: step.quorum }}
            />
            <StyledUl>{resolveGroup(groupId)}</StyledUl>
          </StyledLi>
        </StyledUl>
      );
    }
    if (step.users || (step.group && step.group.is_internal)) {
      const userList = step.users || step.group.members;

      if (type === "creator" && step.quorum < 2) {
        return <StyledUl key={index}>{resolveUsers(userList)}</StyledUl>;
      }
      return (
        <StyledUl key={index}>
          <StyledLi>
            <Text
              i18nKey="approvalsRules:textMode.quorum"
              values={{ nb: step.quorum }}
            />
            <StyledUl>{resolveUsers(userList)}</StyledUl>
          </StyledLi>
        </StyledUl>
      );
    }
    return <NotApplicableText />;
  };

  const resolveWhitelists = (item: number | Whitelist) => {
    let whitelist;
    if (typeof item === "number") {
      whitelist = whitelists.find(w => w.id === item);
    } else {
      whitelist = item;
    }
    if (!whitelist) return;
    return <StyledLi key={whitelist.id}>{whitelist.name}</StyledLi>;
  };

  return (
    <Box flow={10}>
      <Box align="flex-end">
        <Box bg={colors.argile} borderRadius={15} py={2} px={10}>
          <Text fontWeight="bold">{rulesSet.name}</Text>
        </Box>
      </Box>
      <Box justify="center">
        <Text fontWeight="bold" i18nKey="approvalsRules:textMode.creator" />
        {resolveApproverOrCreator(creatorStep, null, "creator")}
      </Box>
      {(whitelistRule || thresholdRule) && (
        <Box>
          <Text
            fontWeight="bold"
            i18nKey="approvalsRules:textMode.conditions"
          />
          {thresholdRule && threshold && (
            <StyledUl>
              <StyledLi>
                <Box horizontal flow={5} align="center">
                  <FaArrowsAltH />
                  <Text i18nKey="approvalsRules:textMode.threshold" />
                </Box>
                <StyledUl>
                  <StyledLi>
                    <span>
                      {"Between "}
                      <strong>
                        <CurrencyUnitValue unit={unit} value={threshold.min} />
                      </strong>
                      {" and "}
                      <strong>
                        {threshold.max ? (
                          <CurrencyUnitValue
                            unit={unit}
                            value={threshold.max}
                          />
                        ) : (
                          "Infinity"
                        )}
                      </strong>
                    </span>
                  </StyledLi>
                </StyledUl>
              </StyledLi>
            </StyledUl>
          )}
          {whitelistRule && (
            <Box>
              <StyledUl>
                <StyledLi>
                  <Box horizontal flow={5} align="center">
                    <FaRegFileAlt />
                    <Text inline i18nKey="approvalsRules:textMode.whitelists" />
                  </Box>
                  <StyledUl>
                    {whitelistRule.data.map(item => resolveWhitelists(item))}
                  </StyledUl>
                </StyledLi>
              </StyledUl>
            </Box>
          )}
        </Box>
      )}
      {approvalSteps && approvalSteps.length > 0 && (
        <Box justify="center">
          <Text fontWeight="bold" i18nKey="approvalsRules:textMode.approvals" />
          {approvalSteps.map((step, i) => resolveApproverOrCreator(step, i))}
        </Box>
      )}
    </Box>
  );
}

const StyledUl = styled.ul`
  margin: 0;
`;

const StyledLi = styled.li`
  word-break: break-all;
`;
