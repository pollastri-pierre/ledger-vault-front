// @flow
import React, { PureComponent } from "react";
import { TextField } from "components";
import { withStyles } from "material-ui/styles";

type Props = {
  classes: { [_: $Keys<typeof styles>]: string },
  updateTitle: Function,
  updateNote: Function,
  title: string,
  note: string
};

const styles = {
  base: {
    padding: "0 40px"
  },
  label: {
    marginBottom: 20
  }
};

class OperationCreationLabel extends PureComponent<Props> {
  updateTitle = (ev: SyntheticEvent<HTMLInputElement>) => {
    this.props.updateTitle(ev.currentTarget.value);
  };
  updateNote = (ev: SyntheticEvent<HTMLInputElement>) => {
    this.props.updateNote(ev.currentTarget.value);
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.base}>
        <TextField
          classes={{ root: classes.label }}
          fullWidth
          value={this.props.title}
          placeholder="Title"
          onChange={this.updateTitle}
        />
        <TextField
          placeholder="Add a comment"
          value={this.props.note}
          fullWidth
          onChange={this.updateNote}
        />
      </div>
    );
  }
}

export default withStyles(styles)(OperationCreationLabel);
