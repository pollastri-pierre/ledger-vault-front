// @flow
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Trans, useTranslation } from "react-i18next";
import type { RestlayEnvironment } from "restlay/connectData";
import type { CryptoCurrency } from "@ledgerhq/live-common/lib/types";
import { FaAddressBook, FaPlus } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import SelectCurrency from "components/SelectCurrency";
import { getBridgeForCurrency } from "bridge";
import { InputText } from "components/base/form";
import type { Address } from "data/types";
import colors from "shared/colors";
import connectData from "restlay/connectData";
import Box from "components/base/Box";
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
const AddAddressForm = (props: Props) => {
  const { addresses, onAddAddress, onEditAddress, onDeleteAddress } = props;
  const [form, setForm] = useState(false);
  return (
    <Box flow={20}>
      <Box flow={20}>
        {!form && (
          <Box width={80}>
            <Button
              onClick={() => setForm(true)}
              type="link"
              variant="info"
              size="small"
            >
              <FaPlus style={{ marginRight: 10 }} /> Add
            </Button>
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
  onDeleteAddress,
}: {
  addr: Address,
  onEditAddress: Address => void,
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
            <AccountIcon currencyId={addr.currency.id} />
            <Text bold uppercase>
              {addr.name}
            </Text>
          </Box>
          <Text>{addr.address}</Text>
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
  currency: CryptoCurrency,
};
const FormAdd = connectData(
  ({
    addr,
    onSubmit,
    onCancel,
    restlay,
  }: {
    addr?: Address,
    onCancel: () => void,
    onSubmit: NewAddForm => void,
    restlay: RestlayEnvironment,
  }) => {
    const [addressError, setAddressError] = useState(null);
    const [currency, setCurrency] = useState<?CryptoCurrency>(
      (addr && addr.currency) || null,
    );
    const [name, setName] = useState((addr && addr.name) || "");
    const [address, setAddress] = useState((addr && addr.address) || "");

    const isAddressFilled = () => name !== "" && address !== "" && !!currency;

    useEffect(() => {
      let unsub = false;
      const effect = async () => {
        if (address && currency) {
          try {
            const bridge = getBridgeForCurrency(currency);
            const errors = await bridge.getRecipientError(
              restlay,
              currency,
              address,
            );
            if (!unsub) {
              setAddressError(errors);
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
    }, [currency, name, address, restlay]);

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
    return (
      <Box flow={20}>
        <Box flow={20}>
          <Box horizontal flow={20}>
            <Box flex="1">
              <SelectCurrency
                autoFocus
                noToken
                placeholder={t("whitelists:create.currency_placeholder")}
                value={currency}
                onChange={val => setCurrency(val ? val.value : null)}
                noOptionsMessage="no-options"
              />
            </Box>
            <Box flex="1">
              <InputText
                placeholder={t("whitelists:create.addr_name_placeholder")}
                maxLength={19}
                onChange={setName}
                value={name}
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
            disabled={!isAddressFilled}
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
