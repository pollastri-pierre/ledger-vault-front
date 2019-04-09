// @flow

import React, { PureComponent } from "react";

import { VictoryPie, VictoryLegend } from "victory";

import Text from "components/base/Text";
import Box from "components/base/Box";

// we need an endpoint for this information or redifine what we want to display
class Statistics extends PureComponent<*> {
  render() {
    const data = [
      { x: 1, y: 30 },
      { x: 2, y: 40 },
      { x: 3, y: 55 },
      { x: 4, y: 5 },
    ];
    const legendData = [
      { name: "Awaiting approval" },
      { name: "Pending" },
      { name: "Completed" },
      { name: "Blocked" },
    ];

    return (
      <Box p={10}>
        <Text bold i18nKey="operatorDashboard:statistics.header" />
        <svg width={400} height={300}>
          <VictoryLegend
            standalone={false}
            colorScale={["gold", "orange", "navy", "tomato"]}
            x={5}
            y={30}
            data={legendData}
          />
          <VictoryPie
            standalone={false}
            width={400}
            height={300}
            padding={{
              left: 190,
              bottom: 130,
              top: 10,
            }}
            innerRadius={40}
            colorScale={["gold", "orange", "navy", "tomato"]}
            data={data}
            labels={() => null}
            animate={{
              onLoad: {
                duration: 1500,
                before: () => ({ _y: -1200, label: " " }),
                after: datum => ({ _y: datum._y }),
              },
            }}
          />
        </svg>
      </Box>
    );
  }
}

export default Statistics;
