// @flow

import React, { useCallback, useMemo, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { DerivationMode } from "@ledgerhq/live-common/lib/derivation";

import type { Account } from "data/types";
import Disabled from "components/Disabled";
import SelectCurrency from "components/SelectCurrency";
import InfoBox from "components/base/InfoBox";
import type { Item as SelectCurrencyItem } from "components/SelectCurrency";
import { Label } from "components/base/form";
import {
  isERC20Token,
  isNotSupportedCoin,
  getDerivationModes,
} from "utils/cryptoCurrencies";
import usePrevious from "hooks/usePrevious";
import HelpLink from "components/HelpLink";
import Text from "components/base/Text";
import Box from "components/base/Box";
import SelectDerivationMode from "components/SelectDerivationMode";
import ExternalLink from "components/icons/ExternalLink";
import colors from "shared/colors";

import EthAccountsRadio from "../EthAccountsRadio";

import {
  findParentAccountInAccounts,
  getAvailableParentsAccounts,
} from "../helpers";

import type { AccountCreationStepProps } from "../types";
import { initialPayload } from "..";

const AccountCreationCurrency = (props: AccountCreationStepProps) => {
  const {
    payload,
    updatePayload,
    allAccounts,
    isEditMode,
    transitionTo,
  } = props;

  const { t } = useTranslation();

  const currencyOrToken = payload.currency || payload.erc20token || null;
  const isAnERC20Token = isERC20Token(currencyOrToken);

  const availableParentAccounts = getAvailableParentsAccounts(
    allAccounts,
    payload.erc20token,
  );

  const parentAccount = findParentAccountInAccounts(
    payload.parentAccount,
    allAccounts,
  );

  const derivationModes = useMemo(() => getDerivationModes(currencyOrToken), [
    currencyOrToken,
  ]);

  const handleChange = useCallback(
    (item: ?SelectCurrencyItem) => {
      const patch = {};
      let onPatched = null;
      if (!item) {
        Object.assign(patch, {
          currency: null,
          erc20token: null,
          parentAccount: null,
        });
      } else if (item.type === "currency") {
        const derivationModes = getDerivationModes(item.value);
        const shouldChooseDerivationMode = derivationModes.length > 1;

        Object.assign(patch, {
          currency: item.value,
          erc20token: null,
          parentAccount: null,
          derivationMode:
            derivationModes.length > 0 ? derivationModes[0] : null,
        });

        if (!isNotSupportedCoin(item.value) && !shouldChooseDerivationMode) {
          onPatched = () => transitionTo("name");
        }
      } else {
        const erc20token = item.value;
        const availableParentAccounts = getAvailableParentsAccounts(
          allAccounts,
          erc20token,
        );

        Object.assign(patch, {
          currency: null,
          erc20token,
          parentAccount: availableParentAccounts.length
            ? { id: availableParentAccounts[0].id }
            : null,
        });
      }
      updatePayload({ ...initialPayload, ...patch }, onPatched);
    },
    [allAccounts, transitionTo, updatePayload],
  );

  const handleChooseParentAccount = useCallback(
    (parentAccount: ?Account) => {
      updatePayload({
        parentAccount: parentAccount ? { id: parentAccount.id } : null,
      });
    },
    [updatePayload],
  );

  const handleChangeDerivationMode = useCallback(
    (derivationMode: DerivationMode) => updatePayload({ derivationMode }),
    [updatePayload],
  );

  const derivationModeSelect = useRef();
  useFocusWhenChange(derivationModeSelect, currencyOrToken);

  return (
    <Disabled disabled={isEditMode}>
      <Box horizontal flow={10}>
        <Box grow>
          <Label>{t("newAccount:currency.label")}</Label>
          <SelectCurrency
            autoFocus
            openMenuOnFocus={!currencyOrToken}
            isDisabled={isEditMode}
            value={currencyOrToken}
            onChange={handleChange}
            noOptionsMessage={({ inputValue }) =>
              t("newAccount:errors.no_currency_found", { inputValue })
            }
          />
        </Box>
        {derivationModes.length > 1 && (
          <Box noShrink width={200}>
            <Label>{t("newAccount:currency.derivationMode")}</Label>
            <SelectDerivationMode
              derivationModes={derivationModes}
              value={payload.derivationMode}
              onChange={handleChangeDerivationMode}
              selectRef={derivationModeSelect}
              openMenuOnFocus
            />
          </Box>
        )}
      </Box>
      {payload.currency && isNotSupportedCoin(payload.currency) && (
        <Box mt={20}>
          <InfoBox withIcon type="warning">
            <Text>{t("newAccount:not_supported")}</Text>
          </InfoBox>
        </Box>
      )}
      {isAnERC20Token && (
        <Box mt={20}>
          {availableParentAccounts.length > 0 ? (
            <EthAccountsRadio
              accounts={availableParentAccounts}
              account={parentAccount}
              onChange={handleChooseParentAccount}
            />
          ) : (
            <InfoBox withIcon type="info">
              <Text>
                {t("newAccount:erc20.infoNewAccount")}{" "}
                <HelpLink subLink="/Content/administrators/accounts/abouterc20tokens.htm">
                  <ExternalLink color={colors.ocean} size={13} />
                </HelpLink>
              </Text>
            </InfoBox>
          )}
        </Box>
      )}
    </Disabled>
  );
};

const useFocusWhenChange = (ref, value) => {
  const prev = usePrevious(value);
  useEffect(() => {
    if (typeof prev === "undefined") return;
    if (prev === value) return;
    const { current } = ref;
    if (!current) return;
    current.focus();
  }, [prev, value, ref]);
};

export default AccountCreationCurrency;
