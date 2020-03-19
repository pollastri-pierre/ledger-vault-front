// @flow

import React, { useState } from "react";
import { FaUser, FaHistory, FaMobileAlt, FaCheck } from "react-icons/fa";
import { Trans, useTranslation } from "react-i18next";
import connectData from "restlay/connectData";
import noop from "lodash/noop";

import type { RestlayEnvironment } from "restlay/connectData";
import { DEVICE_REJECT_ERROR_CODE } from "device";
import FreshAddressesQuery from "api/queries/FreshAddressesQuery";
import type { Account, FreshAddress } from "data/types";
import { verifyAddressFlow } from "device/interactions/hsmFlows";
import colors from "shared/colors";
import { RichModalHeader } from "components/base/Modal";
import Button from "components/base/Button";
import Text from "components/base/Text";
import Copy from "components/base/Copy";
import { InputText, Label } from "components/base/form";
import SelectAccount from "components/SelectAccount";
import InfoBox from "components/base/InfoBox";
import { RestlayTryAgain } from "components/TryAgain";
import DeviceInteraction from "components/DeviceInteraction";
import Box from "components/base/Box";
import AccountsQuery from "api/queries/AccountsQuery";
import { CardError } from "components/base/Card";
import GrowingCard, { GrowingSpinner } from "components/base/GrowingCard";

type Props = {
  selectedAccount: ?Account,
  accounts: Account[],
  onClose: () => void,
};

const IconRetry = () => <FaHistory size={12} />;
const IconBlue = () => <FaMobileAlt size={14} />;

function ReceiveFlow(props: Props) {
  const { selectedAccount, accounts, onClose } = props;
  const [account, setAccount] = useState<?Account>(selectedAccount);
  const { t } = useTranslation();

  return (
    <Box width={600} style={{ minHeight: 400 }}>
      <RichModalHeader Icon={FaUser} title="Receive" onClose={onClose} />
      <Box p={40} flow={20}>
        <Box>
          <Label>{t("receive:selectAccountLabel")}</Label>
          <SelectAccount
            autoFocus={account === null}
            openMenuOnFocus
            accounts={accounts}
            value={account}
            onChange={setAccount}
          />
        </Box>
        {account === null && (
          <InfoBox type="info">{t("receive:selectAccount")}</InfoBox>
        )}
        {!!account && <VerifyFreshAddress key={account.id} account={account} />}
      </Box>
    </Box>
  );
}

type VerifyFreshAddressProps = {
  account: Account,
  freshAddresses: FreshAddress[],
  restlay: RestlayEnvironment,
};

const VerifyFreshAddress = connectData(
  (props: VerifyFreshAddressProps) => {
    const { freshAddresses, account, restlay } = props;
    const freshAddress = freshAddresses[0];
    const [hasBeenVerified, setHasBeenVerified] = useState<boolean | null>(
      null,
    );
    const [isVerifying, setVerifying] = useState(false);
    const { t } = useTranslation();
    const onVerifySuccess = () => {
      setVerifying(false);
      setHasBeenVerified(true);
    };

    const onVerifyError = e => {
      if (e.statusCode && e.statusCode === DEVICE_REJECT_ERROR_CODE) {
        setHasBeenVerified(false);
      }
      setVerifying(false);
    };

    return (
      <Box flow={20}>
        <Box horizontal flow={10} align="center">
          <Box width={300}>
            {isVerifying || hasBeenVerified ? (
              <Copy text={freshAddress.address} />
            ) : (
              <InputText
                grow
                value={"*".repeat(freshAddress.address.length)}
                disabled
                onChange={noop}
              />
            )}
          </Box>
          <Box grow noShrink>
            <Button
              onClick={() => setVerifying(true)}
              type="filled"
              data-test="verifyaddress"
              disabled={isVerifying}
            >
              <Box horizontal flow={10} align="center" justify="center">
                {hasBeenVerified === false ? <IconRetry /> : <IconBlue />}
                {hasBeenVerified === true ? (
                  <Text i18nKey="receive:verifyAgain" noWrap />
                ) : hasBeenVerified === false ? (
                  <Text i18nKey="receive:retry" noWrap />
                ) : (
                  <Text i18nKey="receive:verify" noWrap />
                )}
              </Box>
            </Button>
          </Box>
        </Box>
        {isVerifying ? (
          <Box align="center" grow>
            <DeviceInteraction
              interactions={verifyAddressFlow}
              noCheckVersion
              additionalFields={{
                accountId: account.id,
                fresh_address: freshAddress,
                restlay,
              }}
              onSuccess={onVerifySuccess}
              onError={onVerifyError}
            />
          </Box>
        ) : hasBeenVerified === false ? (
          <InfoBox type="error" alignCenter>
            <div>
              {t("receive:addressRejected_line1")}
              <br />
              <Trans
                i18nKey="receive:addressRejected_line2"
                components={<strong>0</strong>}
              />
            </div>
          </InfoBox>
        ) : hasBeenVerified === true ? (
          <InfoBox type="success" alignCenter>
            <div>
              <Box horizontal align="center" justify="center" flow={5}>
                <FaCheck />
                <Trans
                  i18nKey="receive:addressVerified_line1"
                  components={<strong>0</strong>}
                />
              </Box>
              {t("receive:addressVerified_line2")}
            </div>
          </InfoBox>
        ) : (
          <InfoBox type="warning" alignCenter>
            <div>
              {t("receive:addressNotVerified_line1")}
              <br />
              <Trans
                i18nKey="receive:addressNotVerified_line2"
                components={<strong>0</strong>}
              />
            </div>
          </InfoBox>
        )}
      </Box>
    );
  },
  {
    RenderError: RestlayTryAgain,
    RenderLoading: () => (
      <div
        style={{ height: 122, background: colors.form.bg, borderRadius: 4 }}
      />
    ),
    queries: {
      freshAddresses: FreshAddressesQuery,
    },
    propsToQueryParams: props => ({
      accountId: props.account.id,
    }),
  },
);

export default connectData(
  props => {
    const { match, accounts: accountsConnection, close } = props;
    const accounts = accountsConnection.edges.map(e => e.node);
    const selectedAccount = getAccountById(accounts, match.params.id);
    return (
      <GrowingCard>
        <ReceiveFlow
          selectedAccount={selectedAccount}
          accounts={accounts}
          onClose={close}
        />
      </GrowingCard>
    );
  },
  {
    RenderLoading: GrowingSpinner,
    RenderError: CardError,
    queries: {
      accounts: AccountsQuery,
    },
  },
);

function getAccountById(accounts: Account[], id: string): Account | null {
  if (!id) return null;
  return accounts.find(a => a.id === Number(id)) || null;
}
