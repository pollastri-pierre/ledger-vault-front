// @flow

import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";

import Box from "components/base/Box";
import Text from "components/base/Text";

import errorFormatter from "formatters/error";
import colors from "shared/colors";
import type { RestlayEnvironment } from "restlay/connectData";

type Props = {
  action: () => Promise<*> | *,
  error: Error,
};
export default function TryAgain(props: Props) {
  const isUnmounted = useRef(false);
  const [pending, setPending] = useState(false);
  const { error, action } = props;

  useEffect(() => {
    return () => {
      isUnmounted.current = true;
    };
  }, []);

  const onclick = (e: Event) => {
    e.preventDefault();
    if (pending) return;
    setPending(true);
    Promise.resolve()
      .then(action)
      .catch((e) => e)
      .then(() => {
        if (isUnmounted.current) return;
        setPending(false);
      });
  };

  return (
    <Container p={40} onClick={onclick}>
      <Text i18nKey="common:errorOccured" />
      <Text fontWeight="bold" size="header" i18nKey="common:reload" />
      <Text color={colors.form.error}>{errorFormatter(error)}</Text>
    </Container>
  );
}

const Container = styled(Box).attrs({
  p: 40,
  flow: 15,
  align: "center",
})`
  cursor: pointer;
`;

type ErrProps = {
  error: Error,
  restlay: RestlayEnvironment,
};

export const RestlayTryAgain = ({ error, restlay }: ErrProps) => (
  <TryAgain error={error} action={restlay.forceFetch} />
);
