// @flow

import React, { useState, useMemo } from "react";
import { FaUser, FaHistory, FaMobileAlt, FaCheck } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { Trans, useTranslation } from "react-i18next";
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
import Disabled from "components/Disabled";
import AccountsQuery from "api/queries/AccountsQuery";
import { CardError } from "components/base/Card";
import GrowingCard, { GrowingSpinner } from "components/base/GrowingCard";
import DerivationInput from "components/ReceiveFlow/DerivationInput";
import { AddressPathNotInRange } from "utils/errors";

type Props = {
  selectedAccount: ?Account,
  accounts: Account[],
  onClose: () => void,
};

const IconRetry = () => <FaHistory size={12} />;
const IconBlue = () => <FaMobileAlt size={14} />;

type SelectIndexProps = {
  onChange: (?AddressDaemon) => void,
  addresses: AddressDaemon[],
  selectedAddress: ?AddressDaemon,
  currentIndex: string,
  account: Account,
};

const SelectIndex = connectData(
  (props: SelectIndexProps) => {
    const {
      account,
      selectedAddress,
      onChange,
      addresses,
      currentIndex,
    } = props;
    const [path, setPath] = useState(
      selectedAddress ? selectedAddress.derivation_path.split("/")[1] : "",
    );
    const [error, setError] = useState([]);

    // we remove the "change" addresses
    const addressesWithoutChange = useMemo(() => {
      return addresses.filter((a) => {
        const s = a.derivation_path.split("/");
        return s.length > 1 && s[0] === "0";
      });
    }, [addresses]);

    const _onChange = (val) => {
      setPath(val);
      // we have to find the address corresponding the derivation path
      const derivationPath = `0/${val}`;
      const address = addressesWithoutChange.find(
        (a) => a.derivation_path === derivationPath,
      );

      if (address) {
        setError([]);
      } else {
        setError([
          new AddressPathNotInRange(null, {
            max: addressesWithoutChange.length - 1,
          }),
        ]);
      }
      onChange(address);
    };

    // if current index is 99, user should be able to enter only 2 digits
    // if it is 100, maxLength is 3 char
    const maxLength = `${currentIndex}`.length;
    return (
      <DerivationInput
        prefix={`${account.derivation_path}/0`}
        onChange={_onChange}
        maxLength={maxLength}
        value={path}
        errors={error}
      />
    );
  },
  {
    RenderLoading: SpinnerCentered,
    RenderError: RestlayTryAgain,
    queries: {
      addresses: AddressFromDerivationPathQuery,
    },
    propsToQueryParams: (props) => ({
      accountId: props.account.id,
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

const AdvancedSection = ({
  account,
  selectedAddress,
  onChange,
  currentIndex,
}: {
  onChange: (?AddressDaemon) => void,
  selectedAddress: ?AddressDaemon,
  currentIndex: string,
  account: Account,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <Box flow={10} pb={20}>
      <Box
        flow={5}
        style={{ cursor: "pointer" }}
        horizontal
        align="center"
        onClick={() => setVisible(!visible)}
      >
        {visible ? <IoIosArrowUp /> : <IoIosArrowDown />}
        <Box>Advanced</Box>
      </Box>
      {visible && (
        <Box horizontal align="center" flow={40}>
          <Label>Derivation path</Label>
          <Box grow>
            <SelectIndex
              selectedAddress={selectedAddress}
              account={account}
              currentIndex={currentIndex}
              onChange={onChange}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
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

    const onVerifyError = (e) => {
      if (e.statusCode && e.statusCode === DEVICE_REJECT_ERROR_CODE) {
        setHasBeenVerified(false);
      }
      setVerifying(false);
    };

    const currentIndex = freshAddress.derivation_path.split("/")[1];

    return (
      <Box flow={20}>
        {account.account_type === "Bitcoin" &&
          parseInt(currentIndex, 10) > 0 && (
            <AdvancedSection
              currentIndex={currentIndex}
              account={account}
              selectedAddress={selectedAddress}
              onChange={setSelectedAddress}
            />
          )}
        <Disabled disabled={!selectedAddress}>
          <Box horizontal flow={10} align="center">
            <Box width={300}>
              {(isVerifying || hasBeenVerified) && selectedAddress ? (
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
        </Disabled>
        {isVerifying ? (
          <Box align="center" grow>
            <DeviceInteraction
              interactions={verifyAddressFlow}
              noCheckVersion
              additionalFields={{
                accountId: account.id,
                address: selectedAddress,
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
    propsToQueryParams: (props) => ({
      accountId: props.account.id,
    }),
  },
);

export default connectData(
  (props) => {
    const { match, accounts: accountsConnection, close } = props;
    const accounts = accountsConnection.edges.map((e) => e.node);
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
  return accounts.find((a) => a.id === Number(id)) || null;
}
