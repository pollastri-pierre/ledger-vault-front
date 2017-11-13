//@flow
import React from "react";
import EditableComponent from "../utils/ContentEditable";
import type { Note } from "../../data/types";

function TabLabel(props: { note: Note, changeTitle: Function }) {
  const { note } = props;
  return (
    <div className="operation-label">
      <div key={note.id}>
        <EditableComponent
          className="operation-label-title"
          onChange={props.changeTitle}
          placeholder="Title.."
          value={note.title}
        />
        <EditableComponent
          className="operation-label-body"
          onChange={() => {}}
          placeholder="Message.."
          value={note.body}
        />
        <div className="operation-label-author">
          Published by {note.author.first_name} {note.author.last_name}
        </div>
      </div>
    </div>
  );
}

export default TabLabel;
