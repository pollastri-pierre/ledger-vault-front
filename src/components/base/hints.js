// @flow

import React from "react";
import { Trans } from "react-i18next";

export const maxLengthNonAsciiHints = (maxLength: number) => {
  return [
    {
      key: "maxLength",
      label: (v: string) => (
        <Trans
          i18nKey="form:hints.maxLength"
          values={{ maxLength, nbLeft: maxLength - v.length }}
        />
      ),
      check: (v: string) => v.length <= maxLength,
    },
    {
      key: "nonAscii",
      label: <Trans i18nKey="form:hints.onlyAscii" />,
      check: () => true,
    },
  ];
};

export const uniqName = (name: string, usedNames: string[]) => {
  return [
    {
      key: "uniqName",
      label: () => <Trans i18nKey="form:hints.uniqName" />,
      check: (v: string) => usedNames.indexOf(v) === -1,
    },
  ];
};
