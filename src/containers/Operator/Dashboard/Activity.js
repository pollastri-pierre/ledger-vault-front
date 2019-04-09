// @flow

import React, { PureComponent } from "react";

import moment from "moment";
import styled from "styled-components";

import NoDataPlaceholder from "components/NoDataPlaceholder";
import Text from "components/base/Text";
import Box from "components/base/Box";
import DateFormat from "components/DateFormat";

import colors from "shared/colors";

const BulletIcon = styled(Box).attrs({
  align: "center",
  justify: "center",
})`
  background-color: red;
  border-radius: 50%;
  height: 10px;
  width: 10px;
`;
// NOTE: it was useless spend lots of time to make proper mock, since the status of activities
// is not confirmed for different entities and some things are changing

const mockActivities = [
  {
    id: 1,
    created_on: moment().toDate(),
    message: "A Transaction was created by Linda Smith in the ETH account",
  },
  {
    id: 2,
    created_on: moment()
      .subtract(8, "days")
      .toDate(),
    message: "A Transaction was created by Sean Perry in the BTC account",
  },
];
class Activity extends PureComponent<*> {
  render() {
    return (
      <Box flow={5} p={10}>
        <Text bold i18nKey="operatorDashboard:activity.header" />
        {mockActivities.length > 0 ? (
          <Box>
            {mockActivities.map(activity => (
              <Box key={activity.id} my={10} flow={5}>
                <Box horizontal flow={10} align="center">
                  <BulletIcon />
                  <Box color={colors.lead}>
                    <DateFormat
                      format="ddd D MMM, h:mmA"
                      date={activity.created_on}
                    />
                  </Box>
                </Box>
                <Text small>{activity.message}</Text>
              </Box>
            ))}
          </Box>
        ) : (
          <NoDataPlaceholder title="No activities found." />
        )}
      </Box>
    );
  }
}

export default Activity;
