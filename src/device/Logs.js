// @flow
import React from "react";
import Box from "components/base/Box";
import moment from "moment";

export type Log = {
  id: number,
  date: Date,
  text: string,
};
export default ({ logs }: { logs: Log[] }) =>
  logs && logs.length ? (
    <Box p={10} style={styles.container}>
      {logs.map(log => (
        <div key={log.id}>
          <span style={{ color: "#0ce4bf", userSelect: "none" }}>
            {`${moment(log.date).format("HH:mm:ss")} `}
          </span>
          {log.text}
        </div>
      ))}
    </Box>
  ) : null;

const styles = {
  container: {
    background: "#444",
    color: "white",
    borderRadius: 4,
    overflow: "auto",
    lineHeight: "16px",
    fontSize: 13,
    fontFamily: "monospace",
  },
};
