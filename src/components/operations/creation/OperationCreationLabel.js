// @flow
import React, { PureComponent } from "react";
import { TextField } from "../../../components";

type Props = {};

const styleInput = { fontSize: "16px" };

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
          placeholder="Title"
          inputProps={{ style: styleInput }}
          onChange={this.update}
          style={{ marginBottom: "20px" }}
        />
        <TextField
          className="operation-creation-label-comment"
          id="operation-creation-label-comment"
          placeholder="Comment"
          inputProps={{ style: styleInput }}
          multiline
          onChange={this.update}
        />
      </div>
    );
  }
}

export default OperationCreationLabel;
