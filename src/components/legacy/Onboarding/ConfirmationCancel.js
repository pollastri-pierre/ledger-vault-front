// @flow
import React, { Component } from "react";
import { Title, Introduction } from "components/Onboarding";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import { Trans } from "react-i18next";

import styled from "styled-components";
import HelpLink from "components/HelpLink";
import DialogButton from "components/legacy/DialogButton";

type Props = {
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

  handleChange = (event: SyntheticInputEvent<*>) => {
    const { value } = event.target;
    if (value === "0" || value === "1" || value === "2") {
      this.setState({ value });
    }
  };

  render() {
    const { step, entity, title, toggle, wipe } = this.props;
    const { value } = this.state;

    return (
      <div>
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
        <Footer>
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
        </Footer>
      </div>
    );
  }
}

const Footer = styled.div`
  position: absolute;
  bottom: -40px;
  right: 0;
`;

export default ConfirmationCancel;
