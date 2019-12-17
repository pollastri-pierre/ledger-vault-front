// @flow

import React, { useCallback, useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";

import { hasPendingRequest } from "utils/entities";
import connectData from "restlay/connectData";
import Box from "components/base/Box";
import { InputText, Label } from "components/base/form";

import type { RestlayEnvironment } from "restlay/connectData";
import type { Account, Whitelist } from "data/types";
import type { WalletBridge } from "bridge/types";

import SelectAddress, { CREATED_ADDRESS_UNIQUE_LABEL } from "./SelectAddress";

type Props<T> = {
  transaction: T,
  onChangeTransaction: T => void,
  account: Account,
  whitelists: Whitelist[],
  bridge: WalletBridge<T>,
  restlay: RestlayEnvironment,
};

const INITIAL_RSTATUS = { error: null, warning: null };

function AddressField(props: Props<{ recipient: string }>) {
  const {
    transaction,
    onChangeTransaction,
    account,
    whitelists,
    bridge,
    restlay,
    ...p
  } = props;

  const { recipient } = transaction;

  // TODO the address field errors should be handled
  // on bridge side, cf refactoring with "TransactionStatus"
  const [rStatus, setRStatus] = useState(INITIAL_RSTATUS);

  const [customAddr, setCustomAddr] = useState(null);

  const { t } = useTranslation();

  const handleSetRecipient = useCallback(
    (recipient: string) => {
      const payload = [account, transaction, recipient];
      const tx = bridge.editTransactionRecipient(...payload);
      setRStatus(INITIAL_RSTATUS);
      onChangeTransaction(tx);
    },
    [bridge, onChangeTransaction, account, transaction, setRStatus],
  );

  // run validation each time recipient change
  useRecipientCheck({ recipient, restlay, bridge, account, setRStatus });

  const wlOptions = useWhitelistOptions(account, whitelists, customAddr);
  const wlValue = useWhitelistValue(wlOptions, recipient);

  const handleChangeWl = useCallback(
    v => {
      if (!v) {
        handleSetRecipient("");
        setCustomAddr(null);
        return;
      }

      // save the "custom" created value so we can
      // put it in the options after (so it displays
      // correctly)
      //
      // $FlowFixMe (Flow does not know about __isNew__)
      setCustomAddr(v.__isNew__ ? v.value : null);
      handleSetRecipient(v.value);
    },
    [handleSetRecipient, setCustomAddr],
  );

  const canAddCustomAddress = !accountHasOnlyWhitelists(account);
  const hasAddressToSelect = wlOptions.some(o => o.options.length > 0);

  const errors = rStatus.error ? [rStatus.error] : undefined;
  const warnings = rStatus.warning ? [rStatus.warning] : undefined;

  const field = hasAddressToSelect ? (
    <SelectAddress
      isClearable
      placeholder={t("transactionCreation:steps.account.recipient")}
      canAddCustom={canAddCustomAddress}
      options={wlOptions}
      value={wlValue}
      onChange={handleChangeWl}
      errors={errors}
      warnings={warnings}
    />
  ) : (
    <InputText
      id="address"
      placeholder={t("transactionCreation:steps.account.recipient")}
      onChange={handleSetRecipient}
      value={bridge.getTransactionRecipient(account, transaction)}
      errors={errors}
      warnings={warnings}
      {...p}
    />
  );

  return (
    <Box>
      <Label>{t("transactionCreation:steps.account.recipient")}</Label>
      {field}
    </Box>
  );
}

function useWhitelistOptions(account, whitelists, customAddr) {
  const accountWls = useMemo(() => {
    const { governance_rules } = account;
    if (!governance_rules) return [];
    return (
      governance_rules
        .map(g => g.rules)
        // $FlowFixMe flat exist on Array but Flow doesnt know yet
        .flat()
        .filter(r => r.type === "WHITELIST")
        .map(r => r.data)
        // $FlowFixMe flat exist on Array but Flow doesnt know yet
        .flat()
        .filter((w, i, arr) => arr.findIndex(el => el.id === w.id) === i)
        .map(w => {
          if (typeof w === "number") return whitelists.find(w2 => w2.id === w);

          // we don't use whitelist from account.gov_rule on purpose because we are not sure it will contain last_request
          return whitelists.find(w2 => w2.id === w.id);
        })
        .filter(Boolean)
    );
  }, [account, whitelists]);
  const options = useMemo(() => {
    const options = [];
    accountWls.forEach(w => {
      const data = w.addresses
        .filter(w => w.currency === account.currency)
        .map(address => ({
          label: address.name,
          value: address.address,
          data: address,
          isDisabled: isWhitelistDisabled(w),
        }));
      if (data.length) {
        options.push({
          label: w.name,
          options: data,
          isDisabled: isWhitelistDisabled(w),
          whitelist: w,
        });
      }
    });
    return options;
  }, [account.currency, accountWls]);
  return customAddr
    ? [
        {
          label: "Custom",
          value: customAddr,
          options: [
            {
              label: CREATED_ADDRESS_UNIQUE_LABEL,
              value: customAddr,
              data: { name: "Custom address", address: customAddr },
              isDisabled: false,
            },
          ],
        },
        ...options,
      ]
    : options;
}

function useWhitelistValue(options, recipient) {
  const allAddresses = useMemo(() => {
    // $FlowFixMe flat exist on Array but Flow doesnt know yet
    return options.map(o => o.options).flat();
  }, [options]);
  if (!recipient === "") return null;
  return allAddresses.find(item => item.value === recipient) || null;
}

function useRecipientCheck({
  recipient,
  restlay,
  bridge,
  account,
  setRStatus,
}) {
  return useEffect(() => {
    if (!recipient) return;
    let invalidated = false;
    const currency = getCryptoCurrencyById(account.currency);
    const timeout = setTimeout(async () => {
      const error = await bridge.getRecipientError(
        restlay,
        currency,
        recipient,
        account,
      );
      if (invalidated) return;
      const warning = bridge.getRecipientWarning
        ? await bridge.getRecipientWarning(recipient)
        : null;
      if (invalidated) return;
      setRStatus({ error, warning });
    }, 200);
    return () => {
      invalidated = true;
      clearTimeout(timeout);
    };
  }, [recipient, restlay, bridge, account, setRStatus]);
}

const isWhitelistDisabled = (w: Whitelist) =>
  w.status !== "ACTIVE" || hasPendingRequest(w);

const accountHasOnlyWhitelists = account => {
  const { governance_rules } = account;
  if (!governance_rules) return false;
  return (
    governance_rules.filter(governanceRule =>
      governanceRule.rules.find(rule => rule.type === "WHITELIST"),
    ).length === governance_rules.length
  );
};

export default connectData(AddressField);
