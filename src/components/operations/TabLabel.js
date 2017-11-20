//@flow
import React from "react";
import type { Note } from "../../data/types";

function TabLabel(props: { note: Note }) {
  const { note } = props;
  return (
    <div className="operation-label">
      <h3 className="operation-label-title">{note.title}</h3>
      <div className="operation-label-body">{note.body}</div>
      <div className="operation-label-author">
        Published by {note.author.first_name} {note.author.last_name}
      </div>
    </div>
  );
}

export default TabLabel;
