/* eslint-disable react/prop-types */

import React from "react";
import { storiesOf } from "@storybook/react";

import Box from "components/base/Box";

const styles = {
  grey: { backgroundColor: "rgba(0, 0, 0, 0.1)" },
  red: { backgroundColor: "rgba(255, 0, 0, 0.2)" },
  green: { backgroundColor: "rgba(0, 255, 0, 0.2)" },
  blue: { backgroundColor: "rgba(0, 0, 255, 0.2)" }
};

storiesOf("layout", module).add("Box", () => (
  <Box flow={10} p={10} style={styles.grey}>
    <Box horizontal flow={10}>
      <Box grow style={styles.red} p={20} flow={20}>
        <Box style={styles.blue} p={20} flow={20} />
        <Box style={styles.blue} p={20} flow={20} />
      </Box>
      <Box p={30} style={styles.red} />
    </Box>
    <Box horizontal flow={10} align="center" justify="flex-end">
      <Box px={40} py={20} style={styles.green} />
      <Box style={styles.red} p={5} flow={5}>
        <Box style={{ height: 40, ...styles.blue }} p={10} />
        <Box
          style={{ width: 100, height: 20, ...styles.blue }}
          p={10}
          ml={50}
        />
        <Box
          style={{ width: 100, height: 20, ...styles.blue }}
          p={10}
          ml={50}
        />
      </Box>
    </Box>
  </Box>
));
