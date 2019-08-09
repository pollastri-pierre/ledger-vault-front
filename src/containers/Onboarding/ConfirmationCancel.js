// @flow
import React, { Component } from "react";
import { Title, Introduction } from "components/Onboarding";
import HelpLink from "components/HelpLink";
import DialogButton from "components/legacy/DialogButton";
import { withStyles } from "@material-ui/core/styles";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import { Trans } from "react-i18next";

const styles = {
  base: {},
  footer: {
    position: "absolute",
    bottom: -40,
    right: 0,
  },
};
type Props = {
  classes: { [$Keys<typeof styles>]: string },
  toggle: Function,
  wipe: Function,
  title: string,
  entity: string,
  step: string,
};
type State = {
  value: "0" | "1" | "2",
};

class ConfirmationCancel extends Component<Props, State> {
  state = {
    value: "0",
  };

  handleChange = event => {
    this.setState({ value: event.target.value });
  };

  render() {
    const { classes, step, entity, title, toggle, wipe } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.base}>
        <Title>{title}</Title>
        <Introduction>
          <Trans i18nKey="onboarding:confirmation_cancel.desc" entity={step} />
        </Introduction>
        <FormControl component="fieldset">
          <RadioGroup
            aria-label="Gender"
            name="gender1"
            value={value}
            onChange={this.handleChange}
          >
            <FormControlLabel
              value="0"
              control={<Radio color="primary" />}
              label={
                <Trans
                  i18nKey="onboarding:confirmation_cancel.oops"
                  components={<b>0</b>}
                />
              }
            />
            <FormControlLabel
              value="1"
              control={<Radio color="primary" />}
              label={
                <Trans
                  entity={entity}
                  i18nKey="onboarding:confirmation_cancel.mistake"
                />
              }
            />
            <FormControlLabel
              value="2"
              control={<Radio color="primary" />}
              label={
                <Trans i18nKey="onboarding:confirmation_cancel.security" />
              }
            />
          </RadioGroup>
        </FormControl>
        <div className={classes.footer}>
          {value === "0" && (
            <DialogButton highlight onTouchTap={toggle}>
              Go back
            </DialogButton>
          )}
          {value === "1" && (
            <DialogButton
              highlight
              onTouchTap={wipe}
            >{`Register ${entity} again`}</DialogButton>
          )}
          {value === "2" && (
            <HelpLink support>
              <DialogButton highlight>Contact Support</DialogButton>
            </HelpLink>
          )}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(ConfirmationCancel);
