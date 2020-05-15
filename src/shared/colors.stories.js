/* eslint-disable react/prop-types */

import React from "react";

import { storiesOf } from "@storybook/react";

import Box from "components/base/Box";
import Text from "components/base/Text";
import Card from "components/base/Card";

import colors from "shared/colors";

function getColorTile(cols, name) {
  return Object.keys(cols).map((c) => {
    if (typeof cols[c] !== "string") {
      return getColorTile(cols[c], c);
    }
    return (
      <Card height={140} width={140} key={c} grow m={15} align="center">
        <Text>
          {name} {c}
        </Text>
        <Box
          bg={cols[c]}
          width={70}
          height={70}
          style={{
            border: `1px solid ${colors.argile}`,
          }}
        />
      </Card>
    );
  });
}

storiesOf("general", module).add("Colors", () => {
  return (
    <Box flexWrap="wrap" horizontal justify="space-around">
      {getColorTile(colors)}
    </Box>
  );
});
