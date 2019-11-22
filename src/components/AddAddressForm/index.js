// @flow
import React, { useState, useEffect, useRef } from "react";
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
import { InputText } from "components/base/form";
import type { Address } from "data/types";
import colors from "shared/colors";
import connectData from "restlay/connectData";
import Box from "components/base/Box";
import InfoBox from "components/base/InfoBox";
import Button from "components/base/Button";
import Text from "components/base/Text";
import AccountIcon from "components/AccountIcon";
import useClickOther from "hooks/useClickOther";

type Props = {
  addresses: Address[],
  onAddAddress: Address => void,
  onEditAddress: Address => void,
  onDeleteAddress: Address => void,
};
const NB_MAX_ADDRESSES = 100;
const AddAddressForm = (props: Props) => {
  const { addresses, onAddAddress, onEditAddress, onDeleteAddress } = props;
  const [form, setForm] = useState(false);
  return (
    <Box flow={20}>
      <Box flow={20}>
        {!form && (
          <Box horizontal align="center">
            <Box width={80}>
              <Button
                onClick={() => setForm(true)}
                type="link"
                variant="info"
                disabled={addresses.length === NB_MAX_ADDRESSES}
                size="small"
              >
                <FaPlus style={{ marginRight: 10 }} /> Add
              </Button>
            </Box>
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
        <Box position="relative">
          {form && (
            <FormContainer>
              <FormAdd
                onSubmit={addr => {
                  setForm(false);
                  onAddAddress(addr);
                }}
                addresses={addresses}
                onCancel={() => setForm(false)}
              />
            </FormContainer>
          )}
        </Box>
      </Box>
      <Box flow={5}>
        {addresses.length === 0 ? (
          <NoAddressPlaceholder />
        ) : (
          addresses.map(addr => (
            <AddressRow
              key={addr.id}
              addr={addr}
              onEditAddress={onEditAddress}
              addresses={addresses}
              onDeleteAddress={onDeleteAddress}
            />
          ))
        )}
      </Box>
    </Box>
  );
};

const AddressRow = ({
  addr,
  onEditAddress,
  addresses,
  onDeleteAddress,
}: {
  addr: Address,
  onEditAddress: Address => void,
  addresses: Address[],
  onDeleteAddress: Address => void,
}) => {
  const [editMode, setEditMode] = useState(false);
  const editAddr = addr => {
    setEditMode(false);
    onEditAddress(addr);
  };

  const ref = useRef();
  useClickOther("close-bubbles", ref, () => setEditMode(false));
  return (
    <Container ref={ref}>
      <>
        {editMode && (
          <FormContainer>
            <FormAdd
              addr={addr}
              onSubmit={editAddr}
              addresses={addresses}
              onCancel={() => setEditMode(false)}
            />
          </FormContainer>
        )}
        <Box
          horizontal
          align="center"
          justify="space-between"
          flow={20}
          onClick={() => setEditMode(!editMode)}
          data-type="close-bubbles"
          style={{ padding: 10 }}
        >
          <Box horizontal flow={20} width={200} align="center">
            <AccountIcon currencyId={addr.currency} />
            <Text fontWeight="bold">{addr.name}</Text>
          </Box>
          <Text style={{ fontFamily: "monospace" }}>{addr.address}</Text>
          <div onClick={e => e.stopPropagation()}>
            <Button
              type="link"
              variant="info"
              size="small"
              onClick={() => onDeleteAddress(addr)}
            >
              <MdClose />
            </Button>
          </div>
        </Box>
      </>
    </Container>
  );
};

export default AddAddressForm;

const Container = styled(Box)`
  background: ${colors.cream};
  position: relative;
  border: 1px solid transparent;

  &:hover {
    cursor: pointer;
    border: 1px dashed ${colors.lightGrey};
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
  }: {
    addr?: Address,
    onCancel: () => void,
    addresses: Address[],
    onSubmit: NewAddForm => void,
    restlay: RestlayEnvironment,
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
      <Box flow={20}>
        <Box flow={20}>
          <Box horizontal flow={20}>
            <Box flex="1">
              <SelectCurrency
                autoFocus
                noToken
                placeholder={t("whitelists:create.currency_placeholder")}
                value={curr}
                onChange={val => setCurrency(val ? val.value.id : null)}
                noOptionsMessage={() => "not found"}
              />
            </Box>
            <Box flex="1">
              <InputText
                placeholder={t("whitelists:create.addr_name_placeholder")}
                maxLength={19}
                onChange={setName}
                value={name}
                errors={nameError ? [nameError] : null}
                onlyAscii
                fullWidth
              />
            </Box>
          </Box>
          <InputText
            placeholder={t("whitelists:create.addr_placeholder")}
            value={address}
            onChange={setAddress}
            errors={addressError ? [addressError] : null}
            warnings={warning ? [remapWarningError(warning)] : null}
            fullWidth
          />
        </Box>
        <Box horizontal flow={20} justify="flex-end">
          <Button
            size="small"
            onClick={onCancel}
            disabled={!isAddressFilled}
            type="link"
            variant="info"
          >
            cancel
          </Button>
          <Button
            size="small"
            onClick={submit}
            disabled={!isAddressFilled || !!addressError || !!nameError}
            type="outline"
          >
            OK
          </Button>
        </Box>
      </Box>
    );
  },
);

const FormContainer = styled.div`
  padding: 20px;
  border-radius: 3px;
  width: 621px;
  background: #fbfbfb;
  border: 1px solid ${colors.lightGrey};
  position: absolute;
  left: -1px;
  top: 100%;
  margin-top: 10px;
  z-index: 2;
  box-shadow: ${colors.form.shadow.grey};
`;

const NoAddressPlaceholder = () => (
  <Box
    align="center"
    justify="center"
    flow={10}
    p={20}
    style={{ background: colors.cream }}
  >
    <FaAddressBook size={25} />
    <Text>
      <Trans
        i18nKey="whitelists:create.no_address"
        components={<strong>0</strong>}
      />
    </Text>
  </Box>
);

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
