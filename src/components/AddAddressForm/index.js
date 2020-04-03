// @flow
import React, { useState, useEffect, useRef, useCallback } from "react";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
import Tooltip from "components/base/Tooltip";
import styled from "styled-components";
import { Trans, useTranslation } from "react-i18next";
import { FaPlus, FaCheck } from "react-icons/fa";
import { TiArrowBack } from "react-icons/ti";
import { MdClose } from "react-icons/md";

import {
  AddressDuplicateNameCurrency,
  AddressDuplicateCurrencyAddress,
} from "utils/errors";
import { generateID } from "utils/idGenerator";
import type { RestlayEnvironment } from "restlay/connectData";
import SelectCurrency from "components/SelectCurrency";
import CryptoCurrencyIcon from "components/CryptoCurrencyIcon";
import { getBridgeForCurrency } from "bridge";
import { InputText, Label, Form } from "components/base/form";
import ConvertEIP55 from "components/ConvertEIP55";
import type { Address } from "data/types";
import colors, { opacity } from "shared/colors";
import connectData from "restlay/connectData";
import Box from "components/base/Box";
import InfoBox from "components/base/InfoBox";
import Button from "components/base/Button";
import { maxLengthNonAsciiHints } from "components/base/hints";
import usePrevious from "hooks/usePrevious";

const NB_MAX_ADDRESSES = 100;

const LAYOUT = {
  currency: { noShrink: true, style: { width: 220 } },
  name: { noShrink: true, style: { width: 200 } },
  address: { grow: true },
  actions: {
    flow: 5,
    horizontal: true,
    noShrink: true,
  },
};

type Props = {|
  addresses: Address[],
  onChange: (Address[]) => void,
|};

const AddAddressForm = (props: Props) => {
  const { addresses, onChange } = props;
  const [editedAddress, setEditedAddress] = useState<?Address>(null);

  const stopEditAddress = useCallback(() => setEditedAddress(null), [
    setEditedAddress,
  ]);

  const startEditAddress = useCallback(addr => setEditedAddress(addr), [
    setEditedAddress,
  ]);

  const handleChangeAddress = useCallback(
    (source, edited) => {
      const iteratee = address => (address === source ? edited : address);
      const patched = addresses.map(iteratee);
      onChange(patched);
      setEditedAddress(null);
    },
    [onChange, setEditedAddress, addresses],
  );

  const handleAddAddress = useCallback(
    address => {
      setEditedAddress(null);
      onChange([...addresses, address]);
    },
    [setEditedAddress, onChange, addresses],
  );

  const handleRemoveAddress = useCallback(
    address => {
      const patched = addresses.filter(addr => addr !== address);
      onChange(patched);
    },
    [onChange, addresses],
  );

  const hasReachedMax = addresses.length === NB_MAX_ADDRESSES;

  return (
    <Box flow={20}>
      {hasReachedMax && <MaxAddressWarning />}

      <Box>
        <ColumnsHeader />

        {addresses.map(addr =>
          addr === editedAddress ? (
            <AddressForm
              key={addr.id}
              source={addr}
              addresses={addresses}
              onSubmit={edited => handleChangeAddress(addr, edited)}
              onCancel={stopEditAddress}
              isEdit
            />
          ) : (
            <AddressRow
              key={addr.id}
              addr={addr}
              onRemove={handleRemoveAddress}
              onStartEdit={startEditAddress}
            />
          ),
        )}
        {!editedAddress && !hasReachedMax && (
          <AddressForm onSubmit={handleAddAddress} addresses={addresses} />
        )}
      </Box>
    </Box>
  );
};

const ColumnsHeader = () => {
  const { t } = useTranslation();
  return (
    <Box px={10} flow={10} horizontal>
      <Box {...LAYOUT.currency}>
        <Label>{t("whitelists:create.field_currency")}</Label>
      </Box>
      <Box {...LAYOUT.name}>
        <Label>{t("whitelists:create.field_name")}</Label>
      </Box>
      <Box {...LAYOUT.address}>
        <Label>{t("whitelists:create.field_address")}</Label>
      </Box>
      <Box {...LAYOUT.actions} />
    </Box>
  );
};

const AddressRow = React.memo(
  ({
    addr,
    onRemove,
    onStartEdit,
  }: {
    addr: Address,
    onRemove: Address => void,
    onStartEdit: Address => void,
  }) => {
    const currency = getCryptoCurrencyById(addr.currency);
    const { t } = useTranslation();
    return (
      <AddressRowContainer onClick={() => onStartEdit(addr)}>
        <Box {...LAYOUT.currency}>
          <Box horizontal align="center" flow={10}>
            <CryptoCurrencyIcon
              size={16}
              color={currency.color}
              currency={currency}
            />
            <span>{currency.name}</span>
          </Box>
        </Box>
        <Box {...LAYOUT.name}>
          <Box ellipsis>{addr.name}</Box>
        </Box>
        <Box {...LAYOUT.address}>
          <Box ellipsis>{addr.address}</Box>
        </Box>
        <Box {...LAYOUT.actions}>
          <Tooltip content={t("whitelists:create.remove_addr")}>
            <Button
              type="link"
              size="small"
              data-test="delete_edit"
              stopPropagation
              onClick={() => onRemove(addr)}
            >
              <MdClose size={13} />
            </Button>
          </Tooltip>
        </Box>
      </AddressRowContainer>
    );
  },
);

const AddressRowContainer = styled(Box).attrs({
  horizontal: true,
  align: "center",
  p: 10,
  flow: 10,
})`
  &:hover {
    cursor: pointer;
    background: ${opacity(colors.blue, 0.05)};
  }
  &:active {
    background: ${opacity(colors.blue, 0.09)};
  }
`;

const MaxAddressWarning = () => (
  <InfoBox type="info">
    <Trans
      i18nKey="whitelists:create.max_nb_addresses"
      count={NB_MAX_ADDRESSES}
      values={{ count: NB_MAX_ADDRESSES }}
    />
  </InfoBox>
);

const ADDRESS_NAME_LENGTH = 19;

const AddressForm = connectData(
  ({
    source,
    addresses,
    onSubmit,
    onCancel,
    restlay,
    isEdit,
  }: {|
    source?: Address,
    onCancel: () => void,
    addresses: Address[],
    onSubmit: Address => void,
    restlay: RestlayEnvironment,
    isEdit?: boolean,
  |}) => {
    const { t } = useTranslation();
    const [nameError, setNameError] = useState();
    const [addressError, setAddressError] = useState();
    const [warning, setWarning] = useState(null);
    const [addr, setAddr] = useState(source || genEmptyAddress());
    const inputNameRef = useRef();
    const selectCurrencyRef = useRef();

    const previousAddr = usePrevious(addr);

    const setCurrency = currency => {
      setAddr({ ...addr, currency });
      setAddressError(undefined);
    };

    const setAddress = (address: string) => {
      setAddr({ ...addr, address });
      setAddressError(undefined);
    };

    const setName = name => setAddr({ ...addr, name });
    const currency = addr.currency
      ? getCryptoCurrencyById(addr.currency)
      : null;

    const isFilled = addr.name !== "" && addr.address !== "" && !!addr.currency;
    const isValid =
      isFilled &&
      addressError === null &&
      nameError === null &&
      currency !== null;

    const handleSubmit = () => {
      if (!isValid) return null;
      setAddr(source || genEmptyAddress());
      setNameError(undefined);
      setAddressError(undefined);
      setWarning(null);
      onSubmit(addr);
    };

    useEffect(() => {
      let unsub = false;
      const effect = async () => {
        setNameError(checkNameCurrencyDuplicate(addr, addresses));

        if (addr.address && addr.currency) {
          try {
            const curr = getCryptoCurrencyById(addr.currency);
            if (!curr) return;
            const bridge = getBridgeForCurrency(curr);
            const errors =
              (await bridge.getRecipientError(restlay, curr, addr.address)) ||
              checkCurrencyAddressDuplicate(addr, addresses);
            if (unsub) return;
            const recipientWarning = bridge.getRecipientWarning
              ? await bridge.getRecipientWarning(addr.address)
              : null;
            if (unsub) return;
            setAddressError(errors);
            setWarning(recipientWarning);
          } catch (err) {
            if (unsub) return;
            setAddressError(err);
          }
        }
      };
      effect();
      return () => {
        unsub = true;
      };
    }, [currency, addr, restlay, addresses]);

    // focus management
    useEffect(() => {
      if (previousAddr && previousAddr !== addr) {
        if (addr.currency !== previousAddr.currency) {
          inputNameRef.current && inputNameRef.current.focus();
        }
        if (addr.currency === "" && addr.name === "" && addr.address === "") {
          selectCurrencyRef.current && selectCurrencyRef.current.focus();
        }
      }
    }, [addr, previousAddr]);

    return (
      <Form onSubmit={handleSubmit}>
        <Box px={10} pl={0} py={5} flow={10}>
          <Box flow={10} horizontal align="center">
            <Box {...LAYOUT.currency}>
              <SelectCurrency
                selectRef={selectCurrencyRef}
                autoFocus
                isClearable={false}
                noToken
                placeholder={t("whitelists:create.currency_placeholder")}
                value={currency}
                onChange={val => setCurrency(val ? val.value.id : "")}
                noOptionsMessage={() => "No currencies"}
              />
            </Box>
            <Box {...LAYOUT.name}>
              <InputText
                inputRef={inputNameRef}
                placeholder={t("whitelists:create.addr_name_placeholder")}
                maxLength={ADDRESS_NAME_LENGTH}
                hints={
                  nameError
                    ? undefined
                    : maxLengthNonAsciiHints(ADDRESS_NAME_LENGTH)
                }
                onChange={setName}
                value={addr.name}
                errors={nameError ? [nameError] : undefined}
                warnings={warning ? [warning] : undefined}
                onlyAscii
                fullWidth
                data-test="name_address"
              />
            </Box>
            <Box {...LAYOUT.address}>
              <InputText
                placeholder={t("whitelists:create.addr_placeholder")}
                value={addr.address}
                onChange={setAddress}
                errors={addressError ? [addressError] : undefined}
                fullWidth
                data-test="address"
              />
            </Box>
            <Box {...LAYOUT.actions}>
              {onCancel && (
                <Tooltip content={t("common:cancel")}>
                  <Button onClick={onCancel} data-test="cancel_button">
                    <TiArrowBack size={16} />
                  </Button>
                </Tooltip>
              )}
              <Tooltip
                content={
                  isEdit
                    ? t("whitelists:create.edit_addr")
                    : t("whitelists:create.add_addr")
                }
              >
                <Button
                  onClick={handleSubmit}
                  disabled={!isValid}
                  type="filled"
                  data-test="ok_button"
                >
                  {isEdit ? <FaCheck /> : <FaPlus />}
                </Button>
              </Tooltip>
            </Box>
          </Box>
        </Box>
        {currency && currency.family === "ethereum" && (
          <div style={{ margin: "5px 11px 5px 0px" }}>
            <ConvertEIP55 onChange={setAddress} value={addr.address} />
          </div>
        )}
      </Form>
    );
  },
);

const genEmptyAddress = () => ({
  id: generateID(),
  currency: "",
  address: "",
  name: "",
});

const checkNameCurrencyDuplicate = (current: Address, addresses: Address[]) =>
  addresses
    .filter(a => (current.id ? a.id !== current.id : true))
    .some(a => a.name === current.name && a.currency === current.currency)
    ? new AddressDuplicateNameCurrency()
    : null;

const checkCurrencyAddressDuplicate = (
  current: Address,
  addresses: Address[],
) => {
  return addresses
    .filter(a => (current.id ? a.id !== current.id : true))
    .some(a => a.currency === current.currency && a.address === current.address)
    ? new AddressDuplicateCurrencyAddress()
    : null;
};

export default AddAddressForm;
