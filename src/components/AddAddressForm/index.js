// @flow
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Trans, useTranslation } from "react-i18next";
import {
  NonEIP55Address,
  NonEIP55AddressWhitelist,
  AddressDuplicateNameCurrency,
  AddressDuplicateCurrencyAddress,
} from "utils/errors";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
import type { RestlayEnvironment } from "restlay/connectData";
import { FaAddressBook, FaPlus } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import SelectCurrency from "components/SelectCurrency";
import { getBridgeForCurrency } from "bridge";
import { InputText, Label } from "components/base/form";
import type { Address } from "data/types";
import colors, { opacity } from "shared/colors";
import connectData from "restlay/connectData";
import Box from "components/base/Box";
import InfoBox from "components/base/InfoBox";
import Button from "components/base/Button";
import Text from "components/base/Text";
import AccountIcon from "components/legacy/AccountIcon";

type Props = {
  addresses: Address[],
  onAddAddress: Address => void,
  onEditAddress: Address => void,
  onDeleteAddress: Address => void,
};
const NB_MAX_ADDRESSES = 100;
const AddAddressForm = (props: Props) => {
  const { addresses, onAddAddress, onEditAddress, onDeleteAddress } = props;
  const [showAddForm, setShowAddForm] = useState(false);
  const [editedAddress, setEditedAddress] = useState<?number>(null);
  const stopEditAddress = () => setEditedAddress(null);
  const hasAddress = addresses.length > 0;
  const handleEditAddress = (...p) => {
    onEditAddress(...p);
    setEditedAddress(null);
  };
  return (
    <Box flow={20}>
      {!showAddForm && addresses.length > 0 && (
        <Box horizontal align="center">
          <Button
            onClick={() => setShowAddForm(true)}
            type="filled"
            disabled={addresses.length === NB_MAX_ADDRESSES}
            size="small"
            data-test="add_address"
          >
            <FaPlus style={{ marginRight: 10 }} />{" "}
            <Trans i18nKey="whitelists:create.add_addr" />
          </Button>
          {addresses.length === NB_MAX_ADDRESSES && (
            <InfoBox type="info">
              <Trans
                i18nKey="whitelists:create.max_nb_addresses"
                count={NB_MAX_ADDRESSES}
                values={{ count: NB_MAX_ADDRESSES }}
              />
            </InfoBox>
          )}
        </Box>
      )}

      {showAddForm && (
        <Box position="relative">
          <FormContainer>
            <FormAdd
              onSubmit={addr => {
                setShowAddForm(false);
                onAddAddress(addr);
              }}
              addresses={addresses}
              onCancel={() => setShowAddForm(false)}
            />
          </FormContainer>
        </Box>
      )}

      {!showAddForm && !hasAddress && (
        <NoAddressPlaceholder onClickAdd={() => setShowAddForm(true)} />
      )}

      {hasAddress && (
        <Box
          style={{ border: `1px solid ${colors.form.border}`, borderRadius: 4 }}
        >
          {addresses.map(addr => (
            <AddressRow
              key={addr.id}
              addr={addr}
              onEditAddress={handleEditAddress}
              isEditing={editedAddress === addr.id}
              onStartEditAddress={() => setEditedAddress(addr.id)}
              onStopEditAddress={stopEditAddress}
              addresses={addresses}
              onDeleteAddress={onDeleteAddress}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

const AddressRow = ({
  addr,
  onEditAddress,
  addresses,
  onDeleteAddress,
  isEditing,
  onStartEditAddress,
  onStopEditAddress,
}: {
  addr: Address,
  onEditAddress: Address => void,
  addresses: Address[],
  onDeleteAddress: Address => void,
  isEditing: boolean,
  onStartEditAddress: () => void,
  onStopEditAddress: () => void,
}) => {
  return (
    <Container>
      {isEditing ? (
        <FormContainer hideBorder>
          <FormAdd
            isEdit
            addr={addr}
            onSubmit={onEditAddress}
            addresses={addresses}
            onCancel={onStopEditAddress}
          />
        </FormContainer>
      ) : (
        <Box
          horizontal
          align="center"
          justify="space-between"
          flow={20}
          onClick={onStartEditAddress}
          style={{ padding: 10 }}
        >
          <Box horizontal flow={20} grow align="center">
            <AccountIcon currencyId={addr.currency} />
            <Text fontWeight="bold">{addr.name}</Text>
          </Box>
          <Box noShrink>
            <Text style={{ fontFamily: "monospace" }}>{addr.address}</Text>
          </Box>
          <Box noShrink onClick={e => e.stopPropagation()}>
            <Button
              variant="info"
              size="small"
              data-test="delete_edit"
              onClick={() => onDeleteAddress(addr)}
            >
              <MdClose />
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default AddAddressForm;

const Container = styled(Box)`
  position: relative;

  & + & {
    border-top: 1px solid ${colors.form.border};
  }

  &:hover {
    cursor: pointer;
    background: ${opacity(colors.blue, 0.05)};
  }
  &:active {
    background: ${opacity(colors.blue, 0.09)};
  }
`;

type NewAddForm = {
  id: ?number,
  address: string,
  name: string,
  currency: string,
};

const FormAdd = connectData(
  ({
    addr,
    addresses,
    onSubmit,
    onCancel,
    restlay,
    isEdit,
  }: {
    addr?: Address,
    onCancel: () => void,
    addresses: Address[],
    onSubmit: NewAddForm => void,
    restlay: RestlayEnvironment,
    isEdit?: boolean,
  }) => {
    const [addressError, setAddressError] = useState(null);
    const [nameError, setNameError] = useState(null);
    const [warning, setWarning] = useState(null);

    const [currency, setCurrency] = useState<?string>(
      (addr && addr.currency) || null,
    );
    const [name, setName] = useState((addr && addr.name) || "");
    const [address, setAddress] = useState((addr && addr.address) || "");

    const isAddressFilled = () => name !== "" && address !== "" && !!currency;

    useEffect(() => {
      let unsub = false;
      const effect = async () => {
        const errorName = checkNameCurrencyDuplicate(
          { name, currency, id: addr && addr.id },
          addresses,
        );

        setNameError(errorName);

        if (address && currency) {
          try {
            const curr = getCryptoCurrencyById(currency);
            if (!curr) return;
            const bridge = getBridgeForCurrency(curr);
            const errors =
              (await bridge.getRecipientError(restlay, curr, address)) ||
              checkCurrencyAddressDuplicate(
                { name, address, currency, id: addr && addr.id },
                addresses,
              );
            const recipientWarning = bridge.getRecipientWarning
              ? await bridge.getRecipientWarning(address)
              : null;

            if (!unsub) {
              setAddressError(errors);
              setWarning(recipientWarning);
            }
          } catch (err) {
            if (!unsub) {
              setAddressError(err);
            }
          }
        }
      };
      effect();
      return () => {
        unsub = true;
      };
    }, [currency, name, address, restlay, addresses, addr]);

    const submit = async () => {
      if (!isAddressFilled() || addressError || !currency) return null;
      const data = {
        id: addr && addr.id,
        name,
        address,
        currency,
      };
      onSubmit(data);
    };
    const { t } = useTranslation();
    const curr = currency ? getCryptoCurrencyById(currency) : null;
    return (
      <Box flow={40}>
        <Box flow={10}>
          <Box horizontal flow={20}>
            <Box flex={1}>
              <Label>
                <Trans i18nKey="whitelists:create.field_currency" />
              </Label>
              <SelectCurrency
                autoFocus
                noToken
                placeholder={t("whitelists:create.currency_placeholder")}
                value={curr}
                onChange={val => setCurrency(val ? val.value.id : null)}
                noOptionsMessage={() => "not found"}
              />
            </Box>
            <Box flex={1}>
              <Label>
                <Trans i18nKey="whitelists:create.field_name" />
              </Label>
              <InputText
                placeholder={t("whitelists:create.addr_name_placeholder")}
                maxLength={19}
                onChange={setName}
                value={name}
                errors={nameError ? [nameError] : undefined}
                onlyAscii
                fullWidth
                data-test="name_address"
              />
            </Box>
          </Box>
          <Box>
            <Label>
              <Trans i18nKey="whitelists:create.field_address" />
            </Label>
            <InputText
              placeholder={t("whitelists:create.addr_placeholder")}
              value={address}
              onChange={setAddress}
              errors={addressError ? [addressError] : undefined}
              warnings={warning ? [remapWarningError(warning)] : undefined}
              fullWidth
              data-test="address"
            />
          </Box>
        </Box>
        <Box horizontal flow={10} justify="flex-end">
          <Button
            size="small"
            onClick={onCancel}
            disabled={!isAddressFilled}
            variant="info"
          >
            <Trans i18nKey="common:cancel" />
          </Button>
          <Button
            size="small"
            onClick={submit}
            disabled={!isAddressFilled || !!addressError || !!nameError}
            type="filled"
            data-test="ok_button"
          >
            {isEdit ? (
              <Trans i18nKey="whitelists:create.edit_addr" />
            ) : (
              <Trans i18nKey="whitelists:create.add_addr" />
            )}
          </Button>
        </Box>
      </Box>
    );
  },
);

const FormContainer = styled.div`
  padding: 20px;
  border-radius: 3px;
  background: ${colors.form.bg};
  border: ${p => (p.hideBorder ? "none" : `1px solid ${colors.form.border}`)};
`;

const NoAddressPlaceholder = ({ onClickAdd }: { onClickAdd: () => void }) => (
  <NoAddressPlaceholderContainer>
    <Box horizontal flow={10} align="center" style={{ color: colors.steel }}>
      <FaAddressBook size={18} />
      <Text i18nKey="whitelists:create.no_address" />
    </Box>
    <Button
      data-test="add_address"
      onClick={onClickAdd}
      type="filled"
      size="small"
    >
      <FaPlus style={{ marginRight: 10 }} />{" "}
      <Trans i18nKey="whitelists:create.add_addr" />
    </Button>
  </NoAddressPlaceholderContainer>
);

const NoAddressPlaceholderContainer = styled(Box).attrs({
  align: "center",
  justify: "center",
  flow: 20,
  p: 20,
})`
  background: ${colors.form.bg};
  height: 200px;
  border-radius: 4px;
  border: 1px solid ${colors.form.border};
`;

function remapWarningError(w: Error) {
  if (w instanceof NonEIP55Address) {
    return new NonEIP55AddressWhitelist();
  }
  return w;
}

const checkNameCurrencyDuplicate = (
  current: { name: ?string, currency: ?string, id: ?number },
  addresses: Address[],
) =>
  addresses
    .filter(a => (current.id ? a.id !== current.id : true))
    .some(a => a.name === current.name && a.currency === current.currency)
    ? new AddressDuplicateNameCurrency()
    : null;

const checkCurrencyAddressDuplicate = (
  current: { name: ?string, address: ?string, id: ?number, currency: string },
  addresses: Address[],
) => {
  return addresses
    .filter(a => (current.id ? a.id !== current.id : true))
    .some(a => a.currency === current.currency && a.address === current.address)
    ? new AddressDuplicateCurrencyAddress()
    : null;
};
