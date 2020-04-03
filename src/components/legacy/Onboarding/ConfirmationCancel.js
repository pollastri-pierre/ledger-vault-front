// @flow
import React, { Component } from "react";
import styled from "styled-components";
import { Trans } from "react-i18next";

import Box from "components/base/Box";
import { Title, Introduction } from "components/legacy/Onboarding";
import { Radio } from "components/base/form";
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

type RadioRowProps = {
  isChecked: boolean,
  value: string,
  onClick: string => void,
  label: React$Element<*>,
};

const RadioRow = ({ isChecked, value, onClick, label }: RadioRowProps) => {
  return (
    <Box
      cursor="pointer"
      horizontal
      align="flex-start"
      onClick={() => onClick(value)}
      flow={15}
    >
      <Radio checked={isChecked} />
      <span>{label}</span>
    </Box>
  );
};

class ConfirmationCancel extends Component<Props, State> {
  state = {
    value: "0",
  };

  handleChange = (value: string) => {
    if (value === "0" || value === "1" || value === "2")
      this.setState({ value });
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
        <Box flow={20}>
          <RadioRow
            isChecked={value === "0"}
            value="0"
            onClick={this.handleChange}
            label={
              <Trans
                i18nKey="onboarding:confirmation_cancel.oops"
                components={<b>0</b>}
              />
            }
          />
          <RadioRow
            isChecked={value === "1"}
            value="1"
            onClick={this.handleChange}
            label={
              <Trans
                entity={entity}
                i18nKey="onboarding:confirmation_cancel.mistake"
              />
            }
          />
          <RadioRow
            isChecked={value === "2"}
            onClick={this.handleChange}
            value="2"
            label={<Trans i18nKey="onboarding:confirmation_cancel.security" />}
          />
        </Box>
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
