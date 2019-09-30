// @flow

import React, { useState } from "react";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { FaUser } from "react-icons/fa";
import type { MemoryHistory } from "history";

import colors from "shared/colors";
import { addMessage, addError } from "redux/modules/alerts";
import { login } from "redux/modules/auth";

import VaultCentered from "components/VaultCentered";
import Button from "components/base/Button";
import Absolute from "components/base/Absolute";
import InputField from "components/InputField";
import TransportChooser from "components/TransportChooser";
import Text from "components/base/Text";
import Card from "components/base/Card";
import Box from "components/base/Box";

const mapDispatchToProps = { login, addMessage, addError };

// TODO TODO TODO set to `false`
//
// if set to `true`, instead of doing the login here, we
// do a "hard" redirect to /{domain} page, and login occurs
// here. so it will be on nginx hand to serve one front or another
export const MIGRATION_REDIRECTION = process.env.NODE_ENV === "production";

function Welcome(props: { history: MemoryHistory }) {
  const { history } = props;
  const { t } = useTranslation();
  const [domain, setDomain] = useState(process.env.ORGANIZATION_NAME || "");

  const onChange = (domain: string) => setDomain(domain);

  const onKeyPress = (e: SyntheticKeyboardEvent<Document>) => {
    if (e.key === "Enter") {
      onSubmit();
    }
  };

  const onSubmit = async () => {
    if (MIGRATION_REDIRECTION) {
      const { origin } = window.location;
      const url = `${origin}/${domain}`;
      window.location.href = url;
    } else {
      history.push(domain);
    }
  };

  return (
    <VaultCentered>
      <Card overflow="visible" height={350} position="relative">
        <Absolute top={10} right={10}>
          <TransportChooser />
        </Absolute>
        <Box flow={20} px={20} pt={60} align="center">
          <FaUser color={colors.lightGrey} size={32} />
          <InputField
            value={domain}
            autoFocus
            autoComplete="off"
            InputProps={inputProps}
            onKeyPress={onKeyPress}
            onChange={onChange}
            placeholder={t("welcome:placeholder_domain")}
          />
          <Text i18nKey="welcome:domain_description" />
          <Absolute right={20} bottom={20}>
            <Button
              type="filled"
              data-test="continue_button"
              onClick={onSubmit}
              disabled={!domain}
            >
              <Text i18nKey="welcome:signin" />
            </Button>
          </Absolute>
        </Box>
      </Card>
    </VaultCentered>
  );
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
)(Welcome);
