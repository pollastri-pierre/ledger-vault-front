// @flow

import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";

import type { Account } from "data/types";
import Disabled from "components/Disabled";
import SelectCurrency from "components/SelectCurrency";
import InfoBox from "components/base/InfoBox";
import type { Item as SelectCurrencyItem } from "components/SelectCurrency";
import { Label } from "components/base/form";
import { isERC20Token, isNotSupportedCoin } from "utils/cryptoCurrencies";
import HelpLink from "components/HelpLink";
import Text from "components/base/Text";
import Box from "components/base/Box";
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
        Object.assign(patch, {
          currency: item.value,
          erc20token: null,
          parentAccount: null,
        });

        if (!isNotSupportedCoin(item.value)) {
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

export default AccountCreationCurrency;
