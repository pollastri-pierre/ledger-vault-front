// @flow

import React, { useState } from "react";
import { FaUser, FaHistory, FaMobileAlt, FaCheck } from "react-icons/fa";
import { Trans } from "react-i18next";
import connectData from "restlay/connectData";

import type { RestlayEnvironment } from "restlay/connectData";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
import FreshAddressesQuery from "api/queries/FreshAddressesQuery";
import type { Account, FreshAddress } from "data/types";
import { verifyAddressFlow } from "device/interactions/hsmFlows";
import QRCode from "components/QRCode";
import colors from "shared/colors";
import { RichModalHeader } from "components/base/Modal";
import Button from "components/base/Button";
import Copy from "components/base/Copy";
import { Label } from "components/base/form";
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

  return (
    <Box width={600} style={{ minHeight: 455 }}>
      <RichModalHeader Icon={FaUser} title="Receive" onClose={onClose} />
      <Box p={40} flow={20}>
        <Box>
          <Label>
            <Trans i18nKey="receive:selectAccountLabel" />
          </Label>
          <SelectAccount
            autoFocus={account === null}
            openMenuOnFocus
            accounts={accounts}
            value={account}
            onChange={setAccount}
          />
        </Box>
        {account === null && (
          <InfoBox type="info">
            <Trans i18nKey="receive:selectAccount" />
          </InfoBox>
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
    const currency = getCryptoCurrencyById(account.currency);
    const hash =
      account && account.account_type === "Bitcoin" && currency
        ? `${currency.id}:${freshAddress.address}`
        : `${freshAddress.address}`;
    const [hasBeenVerified, setHasBeenVerified] = useState<boolean | null>(
      null,
    );
    const [isVerifying, setVerifying] = useState(false);

    const onVerifySuccess = () => {
      setVerifying(false);
      setHasBeenVerified(true);
    };

    const onVerifyError = () => {
      setVerifying(false);
      setHasBeenVerified(false);
    };

    return (
      <Box horizontal align="flex-start" justify="space-between" flow={10}>
        <div
          style={{
            marginLeft: 0,
            marginBottom: -10,
            marginRight: 10,
            marginTop: 10,
          }}
        >
          <QRCode hash={hash} size={150} />
        </div>
        <Box flow={10} pt={10}>
          <Copy text={freshAddress.address} />
          {isVerifying ? (
            <Box align="center">
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
          ) : (
            <>
              <Box>
                <Button
                  onClick={() => setVerifying(true)}
                  type="submit"
                  variant="filled"
                  IconLeft={hasBeenVerified === false ? IconRetry : IconBlue}
                >
                  {hasBeenVerified === true ? (
                    <Trans i18nKey="receive:verifyAgain" />
                  ) : hasBeenVerified === false ? (
                    <Trans i18nKey="receive:retry" />
                  ) : (
                    <Trans i18nKey="receive:verify" />
                  )}
                </Button>
              </Box>
              {hasBeenVerified === false ? (
                <InfoBox type="error" alignCenter>
                  <div>
                    <Trans i18nKey="receive:addressRejected_line1" />
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
                    <Trans i18nKey="receive:addressVerified_line2" />
                  </div>
                </InfoBox>
              ) : (
                <InfoBox type="warning" alignCenter>
                  <div>
                    <Trans i18nKey="receive:addressNotVerified_line1" />
                    <br />
                    <Trans
                      i18nKey="receive:addressNotVerified_line2"
                      components={<strong>0</strong>}
                    />
                  </div>
                </InfoBox>
              )}
            </>
          )}
        </Box>
      </Box>
    );
  },
  {
    RenderError: RestlayTryAgain,
    RenderLoading: () => (
      <div
        style={{ height: 175, background: colors.form.bg, borderRadius: 4 }}
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
