// @flow

import { getCurrencyIdFromBlockchainName } from "utils/cryptoCurrencies";
import type { Connection } from "restlay/ConnectionQuery";
import type { Account, ERC20Token } from "data/types";
import type { ParentAccount } from "./types";

export const findParentAccountInAccounts = (
  parentAccount: ?ParentAccount,
  availableParentAccounts: Connection<Account>,
) => {
  const el = availableParentAccounts.edges.find(
    (el) =>
      parentAccount && parentAccount.id && el.node.id === parentAccount.id,
  );
  return el ? el.node : null;
};

export const getAvailableParentsAccounts = (
  allAccounts: Connection<Account>,
  erc20token: ?ERC20Token,
): Account[] => {
  if (!erc20token) return [];
  const parentsIdsOfSameTokenAccounts = allAccounts.edges
    .filter(
      (el) =>
        el.node.account_type === "Erc20" &&
        // $FlowFixMe flow failed to see that we are sure that erc20token is not null nor undefined
        el.node.contract_address === erc20token.contract_address,
    )
    .map((el) => el.node.parent);
  return allAccounts.edges
    .filter(
      (el) =>
        el.node.status !== "PENDING" &&
        el.node.account_type === "Ethereum" &&
        el.node.currency ===
          // $FlowFixMe inference fail again. see up.
          getCurrencyIdFromBlockchainName(erc20token.blockchain_name) &&
        parentsIdsOfSameTokenAccounts.indexOf(el.node.id) === -1,
    )
    .map((el) => el.node);
};
