// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { FaUser } from "react-icons/fa";
import type { MemoryHistory } from "history";

import colors from "shared/colors";
import { addMessage, addError } from "redux/modules/alerts";
import { login } from "redux/modules/auth";
import type { Translate } from "data/types";

import VaultCentered from "components/VaultCentered";
import { ModalFooterButton } from "components/base/Modal";
import Absolute from "components/base/Absolute";
import InputField from "components/InputField";
import Text from "components/base/Text";
import Card from "components/base/Card";
import Box from "components/base/Box";

const mapDispatchToProps = { login, addMessage, addError };

// TODO TODO TODO set to `false`
//
// if set to `true`, instead of doing the login here, we
// do a "hard" redirect to /{domain} page, and login occurs
// here. so it will be on nginx hand to serve one front or another
const MIGRATION_REDIRECTION = process.env.NODE_ENV === "production";

type Props = {
  history: MemoryHistory,
  t: Translate,
};

type State = {
  domain: string,
};

class Welcome extends Component<Props, State> {
  state = {
    domain: process.env.ORGANIZATION_NAME || "",
  };

  onSubmit = async () => {
    const { domain } = this.state;
    if (MIGRATION_REDIRECTION) {
      const { origin } = window.location;
      const url = `${origin}/${domain}`;
      window.location.href = url;
    } else {
      this.props.history.push(domain);
    }
  };

  onChange = (domain: string) => this.setState({ domain });

  onKeyPress = (e: SyntheticKeyboardEvent<Document>) => {
    if (e.key === "Enter") {
      this.onSubmit();
    }
  };

  render() {
    const { t } = this.props;
    const { domain } = this.state;

    return (
      <VaultCentered>
        <Card overflow="visible" height={350} position="relative">
          <Box flow={20} px={20} pt={60} align="center">
            <FaUser color={colors.lightGrey} size={32} />
            <InputField
              value={domain}
              autoFocus
              autoComplete="off"
              InputProps={inputProps}
              onKeyPress={this.onKeyPress}
              onChange={this.onChange}
              placeholder={t("welcome:placeholder_domain")}
            />
            <Text i18nKey="welcome:domain_description" />
            <Absolute right={15} bottom={0}>
              <ModalFooterButton
                data-test="continue_button"
                color={colors.ocean}
                onClick={this.onSubmit}
                isDisabled={!domain}
              >
                <Text i18nKey="common:continue" />
              </ModalFooterButton>
            </Absolute>
          </Box>
        </Card>
      </VaultCentered>
    );
  }
}

const inputProps = {
  inputProps: {
    style: {
      textAlign: "center",
      paddingBottom: 20,
    },
  },
};

export default connect(
  null,
  mapDispatchToProps,
)(withTranslation()(Welcome));
