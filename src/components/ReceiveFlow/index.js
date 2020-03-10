// @flow

import React, { useState } from "react";
import { FaUser, FaHistory, FaMobileAlt, FaCheck } from "react-icons/fa";
import { Trans, useTranslation } from "react-i18next";
import type { OptionProps } from "react-select/src/types";
import { components } from "react-select";
import connectData from "restlay/connectData";
import noop from "lodash/noop";

import type { RestlayEnvironment } from "restlay/connectData";
import { DEVICE_REJECT_ERROR_CODE } from "device";
import FreshAddressesQuery from "api/queries/FreshAddressesQuery";
import AddressFromDerivationPathQuery from "api/queries/AddressFromDerivationPathQuery";
import { SpinnerCentered } from "components/base/Spinner";
import type { Account, AddressDaemon } from "data/types";
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
import Select from "components/base/Select";

type Props = {
  selectedAccount: ?Account,
  accounts: Account[],
  onClose: () => void,
};

const IconRetry = () => <FaHistory size={12} />;
const IconBlue = () => <FaMobileAlt size={14} />;

const customValueStyle = {
  singleValue: styles => ({
    ...styles,
    color: "inherit",
    width: "100%",
    paddingRight: 10,
  }),
};
const GenericOption = ({ address }: { address: AddressDaemon }) => {
  return (
    <Box horizontal justify="space-between" flow={20} width="100%">
      <Text>{address.address}</Text>
      <Text size="small" fontWeight="bold">
        {address.derivation_path}
      </Text>
    </Box>
  );
};
const OptionComponent = (props: OptionProps) => {
  const {
    data: { data: address },
  } = props;
  return (
    <components.Option {...props}>
      <GenericOption address={address} />
    </components.Option>
  );
};

const ValueComponent = (props: OptionProps) => {
  return (
    <components.SingleValue {...props}>
      <GenericOption address={props.data} />
    </components.SingleValue>
  );
};

const customComponents = {
  Option: OptionComponent,
  SingleValue: ValueComponent,
};

type SelectIndexProps = {
  onChange: AddressDaemon => void,
  addresses: AddressDaemon[],
  selectedAddress: ?AddressDaemon,
  currentIndex: string,
  accountId: number,
};

const buildOption = (address: AddressDaemon) => ({
  label: address.address,
  value: `${address.address}`,
  data: address,
});

const SelectIndex = connectData(
  (props: SelectIndexProps) => {
    const { selectedAddress, onChange, addresses } = props;

    return (
      <Select
        options={addresses.map(buildOption)}
        components={customComponents}
        placeholder="Select an index"
        styles={customValueStyle}
        inputId="input_index"
        {...props}
        onChange={onChange}
        value={selectedAddress}
      />
    );
  },
  {
    RenderLoading: SpinnerCentered,
    RenderError: RestlayTryAgain,
    queries: {
      addresses: AddressFromDerivationPathQuery,
    },
    propsToQueryParams: props => ({
      accountId: props.accountId,
      from: 0,
      to: props.currentIndex,
    }),
  },
);

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
  freshAddresses: AddressDaemon[],
  restlay: RestlayEnvironment,
};

const VerifyFreshAddress = connectData(
  (props: VerifyFreshAddressProps) => {
    const { freshAddresses, account, restlay } = props;
    const freshAddress = freshAddresses[0];
    const [selectedAddress, setSelectedAddress] = useState(freshAddress);
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
        {account.account_type === "Bitcoin" && (
          <SelectIndex
            selectedAddress={selectedAddress}
            onChange={addr => setSelectedAddress(addr.data)}
            currentIndex={freshAddress.derivation_path.split("/")[1]}
            accountId={account.id}
          />
        )}
        <Box horizontal flow={10} align="center">
          <Box width={300}>
            {isVerifying || hasBeenVerified ? (
              <Copy text={selectedAddress.address} />
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
