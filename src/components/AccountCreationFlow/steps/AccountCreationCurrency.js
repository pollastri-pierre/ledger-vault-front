// @flow

// ==================================================
// DISCLAIMER: this is legacy code. to be refactored.
// ==================================================

import React, { PureComponent } from "react";
import { Trans } from "react-i18next";
import Radio from "@material-ui/core/Radio";

import type { Account, ERC20Token } from "data/types";
import type { Connection } from "restlay/ConnectionQuery";

import Disabled from "components/Disabled";
import SelectCurrency from "components/SelectCurrency";
import SelectAccount from "components/SelectAccount";
import InfoBox from "components/base/InfoBox";
import type { Item as SelectCurrencyItem } from "components/SelectCurrency";
import { Label } from "components/base/form";
import {
  isERC20Token,
  isNotSupportedCoin,
  getCurrencyIdFromBlockchainName,
} from "utils/cryptoCurrencies";
import HelpLink from "components/HelpLink";
import Text from "components/base/Text";
import Box from "components/base/Box";
import ExternalLink from "components/icons/ExternalLink";
import colors from "shared/colors";

import type { AccountCreationStepProps, ParentAccount } from "../types";
import { initialPayload } from "..";

const findParentAccountInAccounts = (
  parentAccount: ?ParentAccount,
  availableParentAccounts: Connection<Account>,
) => {
  const el = availableParentAccounts.edges.find(
    el => parentAccount && parentAccount.id && el.node.id === parentAccount.id,
  );
  return el ? el.node : null;
};

const getAvailableParentsAccounts = (
  allAccounts: Connection<Account>,
  erc20token: ?ERC20Token,
): Account[] => {
  if (!erc20token) return [];
  const parentsIdsOfSameTokenAccounts = allAccounts.edges
    .filter(
      el =>
        el.node.account_type === "Erc20" &&
        // $FlowFixMe flow failed to see that we are sure that erc20token is not null nor undefined
        el.node.contract_address === erc20token.contract_address,
    )
    .map(el => el.node.parent);
  return allAccounts.edges
    .filter(
      el =>
        el.node.status !== "PENDING" &&
        el.node.account_type === "Ethereum" &&
        el.node.currency ===
          // $FlowFixMe inference fail again. see up.
          getCurrencyIdFromBlockchainName(erc20token.blockchain_name) &&
        parentsIdsOfSameTokenAccounts.indexOf(el.node.id) === -1,
    )
    .map(el => el.node);
};

class AccountCreationCurrencies extends PureComponent<AccountCreationStepProps> {
  handleChooseParentAccount = (parentAccount: ?Account) => {
    this.props.updatePayload({
      parentAccount: parentAccount ? { id: parentAccount.id } : null,
    });
  };

  handleChange = (item: ?SelectCurrencyItem) => {
    const { updatePayload, allAccounts, transitionTo } = this.props;
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
  };

  render() {
    const { payload, allAccounts, isEditMode } = this.props;

    const currencyOrToken = payload.currency || payload.erc20token || null;

    const displayERC20Box = isERC20Token(currencyOrToken);

    const availableParentAccounts = getAvailableParentsAccounts(
      allAccounts,
      payload.erc20token,
    );

    const parentAccount = findParentAccountInAccounts(
      payload.parentAccount,
      allAccounts,
    );

    return (
      <Disabled disabled={isEditMode}>
        <Label>
          <Trans i18nKey="newAccount:currency.label" />
        </Label>
        <SelectCurrency
          autoFocus
          openMenuOnFocus={!currencyOrToken}
          isDisabled={isEditMode}
          value={currencyOrToken}
          onChange={this.handleChange}
          noOptionsMessage={({ inputValue }) => (
            <Trans
              i18nKey="newAccount:errors.no_currency_found"
              values={{ inputValue }}
            />
          )}
        />
        {payload.currency && isNotSupportedCoin(payload.currency) && (
          <Box mt={20}>
            <InfoBox withIcon type="warning">
              <Text>
                <Trans i18nKey="newAccount:not_supported" />
              </Text>
            </InfoBox>
          </Box>
        )}
        {displayERC20Box && (
          <Box mt={20}>
            {availableParentAccounts.length > 0 ? (
              <EthAccountsRadio
                accounts={availableParentAccounts}
                account={parentAccount}
                onChange={this.handleChooseParentAccount}
              />
            ) : (
              <InfoBox withIcon type="info">
                <Text>
                  <Trans i18nKey="newAccount:erc20.infoNewAccount" />{" "}
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
  }
}

function EthAccountsRadio({
  onChange,
  account,
  accounts,
}: {
  accounts: Account[],
  account: ?Account,
  onChange: (?Account) => void,
}) {
  const onChooseNull = () => onChange(null);
  const selectFirstIfNotSet = () => {
    if (!account) {
      onChange(accounts[0]);
    }
  };

  return (
    <>
      <Box
        cursor="pointer"
        horizontal
        align="flex-start"
        onClick={selectFirstIfNotSet}
      >
        <Radio color="primary" checked={account !== null} />
        <Box my={15}>
          <Trans i18nKey="newAccount:erc20.selectExisting" />
          <Box mt={10} width={380}>
            <SelectAccount
              accounts={accounts}
              value={account || accounts[0]}
              onChange={onChange}
            />
          </Box>
        </Box>
      </Box>
      <Box cursor="pointer" horizontal align="center" onClick={onChooseNull}>
        <Radio color="primary" checked={account === null} />
        <Text i18nKey="newAccount:erc20.createNew" />
      </Box>
    </>
  );
}

export default AccountCreationCurrencies;
