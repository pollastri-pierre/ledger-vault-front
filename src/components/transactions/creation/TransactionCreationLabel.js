// @flow
import React, { PureComponent } from "react";
import TextField from "components/utils/TextField";
import type { Translate } from "data/types";
import { translate } from "react-i18next";
import { withStyles } from "@material-ui/core/styles";

type Props = {
  classes: { [_: $Keys<typeof styles>]: string },
  updateTitle: Function,
  t: Translate,
  updateNote: Function,
  title: string,
  note: string,
};

const styles = {
  base: {
    padding: "0 40px",
  },
  label: {
    marginBottom: 20,
  },
  comment: {
    marginTop: 5,
  },
};

class TransactionCreationLabel extends PureComponent<Props> {
  updateTitle = (ev: SyntheticInputEvent<*>) => {
    this.props.updateTitle(ev.currentTarget.value);
  };

  updateNote = (ev: SyntheticInputEvent<*>) => {
    this.props.updateNote(ev.currentTarget.value);
  };

  render() {
    const { classes, t } = this.props;

    return (
      <div className={classes.base}>
        <TextField
          classes={{ root: classes.label }}
          inputProps={{
            style: {
              color: "black",
            },
          }}
          fullWidth
          value={this.props.title}
          placeholder={t("newTransaction:label.title_note")}
          onChange={this.updateTitle}
        />
        <div style={{ marginTop: 10 }} />
        <TextField
          classes={{ root: classes.comment }}
          inputProps={{
            style: {
              color: "black",
            },
          }}
          placeholder={t("newTransaction:label.add_comment")}
          value={this.props.note}
          fullWidth
          onChange={this.updateNote}
        />
      </div>
    );
  }
}

export default withStyles(styles)(translate()(TransactionCreationLabel));
