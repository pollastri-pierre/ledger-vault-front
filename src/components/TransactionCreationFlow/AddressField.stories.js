import React, { useState, useMemo, useEffect } from "react";
import cloneDeep from "lodash/cloneDeep";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
import { storiesOf } from "@storybook/react";

import { genUsers, genAccounts } from "data/mock-entities";
import Box from "components/base/Box";
import { Label } from "components/base/form";
import SelectAccount from "components/SelectAccount";
import { getBridgeForCurrency } from "bridge";
import backendDecorator from "stories/backendDecorator";
import AddressField from "./AddressField";

const users = genUsers(3);
const accounts = genAccounts(3, { users });

setupRules(accounts);
const whitelists = extractWhitelists(accounts);

const mock = [
  {
    url: /\/validation\/.*/,
    res: () => ({ is_valid: true }),
  },
];

storiesOf("components", module)
  .addDecorator(backendDecorator(mock))
  .add("AddressField", () => <Wrapper />);

const Wrapper = () => {
  const [account, setAccount] = useState(accounts[0]);
  const bridge = useMemo(() => {
    const currency = getCryptoCurrencyById(account.currency);
    return getBridgeForCurrency(currency);
  }, [account]);
  const [transaction, setTransaction] = useState(null);
  useEffect(() => {
    setTransaction(bridge.createTransaction(account));
  }, [bridge, account]);

  if (!transaction) return null;

  return (
    <Box flow={20} width={600}>
      <Box>
        <Label>Account</Label>
        <SelectAccount
          accounts={accounts}
          value={account}
          onChange={setAccount}
        />
      </Box>
      <AddressField
        transaction={transaction}
        onChangeTransaction={setTransaction}
        account={account}
        whitelists={whitelists}
        bridge={bridge}
        restlay={null}
      />
    </Box>
  );
};

function setupRules(accounts) {
  accounts[0].name = "Whitelists + custom";
  accounts[1].name = "No whitelists";
  accounts[2].name = "Only whitelists";

  // remove whitelist step from account 1
  accounts[1].governance_rules[0].rules.splice(1, 1);

  // add a "custom allowed" rule on account 2
  const ruleCopy = cloneDeep(accounts[0].governance_rules[0]);
  ruleCopy.rules.splice(1, 1);
  ruleCopy.name = "Rule 2";
  accounts[0].governance_rules.push(ruleCopy);
}

function extractWhitelists(accounts) {
  const whitelists = [];
  accounts.forEach((account) => {
    account.governance_rules.forEach((set) => {
      set.rules.forEach((rule) => {
        if (rule.type !== "WHITELIST") return;
        rule.data.forEach((wl) => {
          const found = whitelists.find((w) => w.id === wl.id);
          if (found) return;
          whitelists.push(wl);
        });
      });
    });
  });
  return whitelists;
}
