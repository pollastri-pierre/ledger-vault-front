// @flow
import React, { PureComponent } from "react";
import { TextField } from "components";
import { withStyles } from "material-ui/styles";

type Props = {
  classes: { [_: $Keys<typeof styles>]: string },
};

const styleInput = { fontSize: "16px" };
const styleLabel = { fontSize: "16px", fontWeight: 600 };

const styles = {
  base: {
    padding: "0 40px",
  },
  label: {
    marginBottom: 20,
  },
};

class OperationCreationLabel extends PureComponent<Props> {
  update = (ev: SyntheticEvent<HTMLInputElement>) => {
    console.warn("NOT IMPLEMENTED", ev.currentTarget.value);
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.base}>
        <TextField
          classes={{ root: classes.label }}
          fullWidth
          placeholder="Title"
          inputProps={{ style: styleLabel }}
          onChange={this.update}
        />
        <TextField
          placeholder="Add a comment"
          inputProps={{ style: styleInput }}
          fullWidth
          onChange={this.update}
        />
      </div>
    );
  }
}

export default withStyles(styles)(OperationCreationLabel);
