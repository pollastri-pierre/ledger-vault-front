// @flow
import React, { PureComponent } from "react";
import { TextField } from "../../../components";

type Props = {
  title: string,
  comment: string,
  updateTitle: Function,
  updateComment: Function
};

class OperationCreationLabel extends PureComponent<Props> {
  update = (ev: SyntheticEvent<HTMLInputElement>) => {
    console.warn("NOT IMPLEMENTED", ev.currentTarget.value);
  };

  render() {
    return (
      <div className="operation-creation-label">
        <TextField
          className="operation-creation-label-title"
          id="operation-creation-label-title"
          hintText="Title"
          onChange={this.update}
        />
        <TextField
          className="operation-creation-label-comment"
          id="operation-creation-label-comment"
          hintText="Comment"
          multiLine
          onChange={this.update}
        />
      </div>
    );
  }
}

export default OperationCreationLabel;
