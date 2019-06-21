// @flow
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import type { Note } from "data/types";

// after a migration, old notes will be created by SYSTEM ADMIN
const SYS_ADMIN_ID = 1;

const styles = {
  title: {
    outline: "none",
    fontSize: "13px",
    color: "#000",
    fontWeight: "600",
    paddingBottom: "16px",
    marginBottom: "16px",
    borderBottom: "1px solid #eee",
  },
  body: {
    outline: "none",
    fontSize: "13px",
    color: "#000",
    paddingBottom: "16px",
    marginBottom: "16px",
    lineHeight: "20px",
    borderBottom: "1px solid #eee",
  },
  author: {
    fontSize: "11px",
    color: "#999",
  },
};
function TabLabel(props: { note: Note, classes: Object }) {
  const { note, classes } = props;
  if (note && note.title !== "" && note.content !== "") {
    return (
      <div>
        <h3 className={classes.title}>{note.title}</h3>
        <div className={classes.body}>{note.content}</div>
        {note.created_by.id !== SYS_ADMIN_ID && (
          <div className={classes.author}>
            Published by {note.created_by.username}
          </div>
        )}
      </div>
    );
  }
  return <div>No note for this transaction</div>;
}

export default withStyles(styles)(TabLabel);
