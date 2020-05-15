// @flow

import React, { useMemo, useCallback } from "react";
import { FiExternalLink } from "react-icons/fi";
import { FaExchangeAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";

import * as eip55 from "utils/eip55";
import { Helper, HelperTitle } from "components/base/Helper";
import Copy from "components/base/Copy";
import Button from "components/base/Button";
import Box from "components/base/Box";

const ETH_ADDR_REGEX = /^(0x)?[0-9a-f]{40}$/i;
const isETHAddress = (v) => ETH_ADDR_REGEX.test(v);

type Props = {|
  value: string,
  onChange: (string) => void,
  EmptyState?: React$ComponentType<{}>,
|};

const ConvertEIP55 = (props: Props) => {
  const { value, onChange, EmptyState } = props;

  const { t } = useTranslation();
  const isETHAddr = useMemo(() => isETHAddress(value), [value]);
  const isEIP55 = useMemo(() => isETHAddr && eip55.isChecksumAddress(value), [
    value,
    isETHAddr,
  ]);
  const converted = useMemo(() => eip55.toCheckSumAddress(value), [value]);

  const handleConvert = useCallback(
    () => onChange(eip55.toCheckSumAddress(value)),
    [value, onChange],
  );

  if (!isETHAddr || isEIP55) return EmptyState ? <EmptyState /> : null;

  return (
    <Helper>
      <HelperTitle>{t("convertEIP55:title")}</HelperTitle>
      <p>
        {t("convertEIP55:desc")}{" "}
        <a
          href={t("convertEIP55:linkURL")}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("convertEIP55:linkLabel")} <FiExternalLink size={13} />
        </a>
      </p>
      <p>{t("convertEIP55:desc2")}</p>
      <Box style={{ fontSize: 13 }} align="flex-start" mb={20}>
        <Copy bg="white" text={converted} />
      </Box>
      <Button type="filled" onClick={handleConvert}>
        <Box horizontal align="center" flow={5}>
          <FaExchangeAlt />
          <span>{t("convertEIP55:cta")}</span>
        </Box>
      </Button>
    </Helper>
  );
};

export default ConvertEIP55;
