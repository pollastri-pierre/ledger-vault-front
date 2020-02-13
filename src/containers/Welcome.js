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
import TransportChooser from "components/TransportChooser";
import Text from "components/base/Text";
import Card from "components/base/Card";
import Box from "components/base/Box";
import { Form, InputText } from "components/base/form";

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
          <Form onSubmit={onSubmit}>
            <InputText
              value={domain}
              autoFocus
              onChange={onChange}
              placeholder={t("welcome:placeholder_domain")}
              align="center"
            />
          </Form>
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

export default connect(null, mapDispatchToProps)(Welcome);
