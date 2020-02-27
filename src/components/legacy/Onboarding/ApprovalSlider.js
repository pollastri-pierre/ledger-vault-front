// @flow
import React from "react";
import styled from "styled-components";
import { withTranslation, Trans } from "react-i18next";

import colors from "shared/colors";
import type { Translate } from "data/types";
import Disabled from "components/Disabled";
import Arrow from "components/icons/full/ArrowDown";

const ApprovalSlider = ({
  number,
  total,
  min,
  max,
  onChange,
  t,
}: {
  number: number,
  min?: number,
  max?: number,
  total: number,
  onChange: number => void,
  t: Translate,
}) => (
  <Container>
    <Flex>
      <Bold>
        <Trans
          i18nKey="onboarding:administrators_scheme.nb_required"
          count={number}
        />
      </Bold>
      <Out>
        <Trans
          i18nKey="onboarding:administrators_scheme.out_of"
          values={{ total }}
        />
      </Out>
    </Flex>
    <Bars>
      {Array(total)
        .fill()
        .map((o, i) => {
          const width = `calc(${100 / total}% - 5px)`;
          return (
            <Bar
              key={i} // eslint-disable-line react/no-array-index-key
              selected={i < number}
              style={{ width }}
            />
          );
        })}
    </Bars>
    <Flex>
      <Disabled disabled={min && number === min}>
        <Require
          data-test="edit-admin-rule_less"
          onClick={() => {
            if (!min || number - 1 >= min) {
              onChange(number - 1);
            }
          }}
        >
          <LeftArrow />
          {t("onboarding:administrators_scheme.require_less")}
        </Require>
      </Disabled>
      <Disabled disabled={max && number === max}>
        <Require
          data-test="edit-admin-rule_more"
          onClick={() => {
            if (number + 1 <= total && (!max || number + 1 <= max)) {
              onChange(number + 1);
            }
          }}
        >
          {t("onboarding:administrators_scheme.require_more")}
          <RightArrow />
        </Require>
      </Disabled>
    </Flex>
  </Container>
);

const Container = styled.div`
  margin-bottom: 40px;
`;

const Flex = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Bold = styled.div`
  font-size: 13px;
  font-weight: 600;
`;

const Bars = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
`;

const Bar = styled.div`
  height: 3px;
  width: 60px;
  background: ${p => (p.selected ? colors.ocean : colors.mouse)};
  display: inline-block;
  margin-right: 5px;
`;

const Out = styled.div`
  font-size: 12px;
  color: ${colors.steel};
`;

const LeftArrow = styled(Arrow)`
  fill: ${colors.ocean};
  margin-right: 8px;
  transform: rotate(90deg);
`;

const RightArrow = styled(Arrow)`
  fill: ${colors.ocean};
  margin-left: 8px;
  transform: rotate(-90deg);
`;

const Require = styled.span`
  color: ${colors.ocean};
  font-size: 11px;
  text-transform: uppercase;
  font-weight: 600;
  cursor: pointer;
`;

export default withTranslation()(ApprovalSlider);
