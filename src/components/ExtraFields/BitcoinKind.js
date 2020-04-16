// @flow

import React, { useState } from "react";
import styled from "styled-components";
import { useTranslation, Trans } from "react-i18next";
import { components as reactSelectComponents } from "react-select";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import { IoIosArrowDown, IoIosArrowUp, IoIosSettings } from "react-icons/io";
import type { OptionProps } from "react-select/src/types";

import colors from "shared/colors";
import type { EditProps } from "bridge/types";
import Select from "components/base/Select";
import { UTXO_PICKING_STRATEGY } from "utils/utxo";
import Box from "components/base/Box";
import { Label } from "components/base/form";
import type { Transaction as BitcoinTransaction } from "bridge/BitcoinBridge";

const iconChecked = <MdCheckBox />;
const iconUnchecked = <MdCheckBoxOutlineBlank />;

const CheckBoxOption = (props: OptionProps) => (
  <reactSelectComponents.Option {...props}>
    <Box horizontal align="center" flow={10}>
      {props.isSelected ? iconChecked : iconUnchecked}
      <span>{props.label}</span>
    </Box>
  </reactSelectComponents.Option>
);

const buildOption = (s: string) => ({
  value: s,
  label: <Trans i18nKey={`transactionCreation:strategy.${s}`} />,
  data: s,
});

const options = Object.keys(UTXO_PICKING_STRATEGY).map(buildOption);

const ExtraFieldsBitcoin = (props: EditProps<BitcoinTransaction>) => {
  const { transaction, onChangeTransaction } = props;
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  const handleChange = option => {
    onChangeTransaction({
      ...transaction,
      utxoPickingStrategy: option ? option.value : null,
      estimatedFees: null,
      estimatedMaxAmount: null,
      error: null,
    });
  };
  const value = options.find(o => o.value === transaction.utxoPickingStrategy);

  return (
    <Box flow={15}>
      <AdvancedContainer
        onClick={() => setVisible(!visible)}
        horizontal
        align="center"
        justify="space-between"
      >
        <Box horizontal align="center" flow={5}>
          <div>
            <IoIosSettings size={18} />
          </div>
          <Label>Advanced</Label>
        </Box>
        <Box>{visible ? <IoIosArrowUp /> : <IoIosArrowDown />}</Box>
      </AdvancedContainer>
      {visible && (
        <Box width={280}>
          <Label>
            {t("transactionCreation:steps.account.utxo_picking_strategy")}
          </Label>
          <Select
            {...props}
            isClearable
            openMenuOnFocus
            placeholder={"Choose a UTXO selection strategy"}
            value={value}
            options={options}
            onChange={handleChange}
            components={{ Option: CheckBoxOption }}
            width={100}
          />
        </Box>
      )}
    </Box>
  );
};

export default ExtraFieldsBitcoin;

const AdvancedContainer = styled(Box).attrs({ p: 10 })`
  cursor: pointer;
  background: ${colors.form.bg};
`;
