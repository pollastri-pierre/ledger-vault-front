// @flow

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
import { connect } from "react-redux";
import { FaRegCopy, FaExchangeAlt } from "react-icons/fa";

import { withMe } from "components/UserContextProvider";
import connectData from "restlay/connectData";
import LineRow from "components/LineRow";
import Modal from "components/base/Modal";
import Button from "components/base/Button";
import NotApplicableText from "components/base/NotApplicableText";
import Box from "components/base/Box";
import Text from "components/base/Text";
import { currencyExchangeSelector } from "redux/modules/exchanges";
import SaveAccountSettingsMutation from "api/mutations/SaveAccountSettingsMutation";
import Select from "components/base/Select";
import type { RestlayEnvironment } from "restlay/connectData";
import colors from "shared/colors";
import type { Account, User } from "data/types";
import AccountXpub from "./AccountXpub";

type Props = {
  account: Account,
  restlay: RestlayEnvironment,
  exchange: string,
  me: User,
};

type State = {
  setttings: boolean,
  isXpubModalOpen: boolean,
};

const mapStateToProps = (state: State, props: Props) => {
  const { account } = props;
  const currency = getCryptoCurrencyById(account.currency);
  return {
    exchange: currencyExchangeSelector(state, currency),
  };
};

function AccountSettings(props: Props) {
  const { account, exchange, me, restlay } = props;
  const [settings, setSettings] = useState(account.settings);
  const [isXpubModalOpen, setXpubModalOpen] = useState(false);
  const curr = getCryptoCurrencyById(account.currency);
  const units = curr.units;
  const { t } = useTranslation();

  const options = units.map(u => ({
    label: u.code,
    value: u.code,
    data: u,
  }));

  const onUnitChange = unit => {
    setSettings(settings => ({ ...settings, currency_unit: unit.data }));
    const m = new SaveAccountSettingsMutation({
      account,
      currency_unit: unit.data.name,
    });
    restlay.commitMutation(m);
  };

  const onXpubModal = () => {
    setXpubModalOpen(!isXpubModalOpen);
  };

  const current_unit = options.find(
    o => o.data.code === settings.currency_unit.code,
  );
  return (
    <Box flow={0}>
      <LineRow label={t("accountSettings:general.units")} noOverflowHidden>
        <Box width={100}>
          <Select
            value={current_unit}
            placeholder="unit"
            options={options}
            onChange={onUnitChange}
          />
        </Box>
      </LineRow>
      <LineRow label={t("accountSettings:general.exchange")}>
        <Box horizontal align="center" flow={5}>
          <FaExchangeAlt size={13} color={colors.lightGrey} />
          <Text fontWeight="bold">{exchange || <NotApplicableText />}</Text>
        </Box>
      </LineRow>
      {me.role === "ADMIN" &&
        account.account_type === "Bitcoin" &&
        account.xpub && (
          <>
            <LineRow label={t("accountSettings:advanced.derivation_path")}>
              <Text size="small">{account.derivation_path}</Text>
            </LineRow>
            <LineRow label={t("accountSettings:advanced.xpub")}>
              <Button
                type="filled"
                variant="primary"
                size="small"
                onClick={onXpubModal}
              >
                <Box horizontal flow={5} align="center">
                  <FaRegCopy />
                  <Text>Copy XPUB</Text>
                </Box>
              </Button>
              <Modal isOpened={isXpubModalOpen} onClose={onXpubModal}>
                <AccountXpub onClose={onXpubModal} account={account} />
              </Modal>
            </LineRow>
          </>
        )}
    </Box>
  );
}

export default connectData(
  connect(mapStateToProps, null)(withMe(AccountSettings)),
);
