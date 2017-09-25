import React from 'react';
import PropTypes from 'prop-types';
import { EditableComponent } from '../../components';

function TabLabel(props) {
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

        {(note.author.firstname && note.author.name) ?
          <div className="operation-label-author">
            Published by {note.author.firstname} {note.author.name}
          </div>
          : false
        }
      </div>
    </div>
  );
}

TabLabel.propTypes = {
  note: PropTypes.shape({}).isRequired,
};

export default TabLabel;

