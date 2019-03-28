// @flow

import { translate } from "react-i18next";
import React, { PureComponent } from "react";
import { withStyles } from "@material-ui/core/styles";

import InputField from "components/InputField";
import InfoBox from "components/base/InfoBox";
import Text from "components/base/Text";
import Box from "components/base/Box";
import ModalSubTitle from "components/operations/creation/ModalSubTitle";
import { getCryptoCurrencyIcon } from "utils/cryptoCurrencies";

import type { Translate } from "data/types";
import type { AccountCreationStepProps } from "../types";

import ERC20RenderName from "./ERC20RenderName";

const inputProps = {
  maxLength: 19,
  onlyAscii: true,
};

const styles = {
  title: {
    fontSize: 11,
    fontWeight: 600,
    textTransform: "uppercase",
    marginBottom: 20,
    display: "block",
  },
  relative: {
    position: "relative",
  },
};

type Props = AccountCreationStepProps & {
  classes: { [_: $Keys<typeof styles>]: string },
  t: Translate,
};

class AccountCreationOptions extends PureComponent<Props> {
  handleChangeName = (name: string) => {
    const { updatePayload } = this.props;
    updatePayload({ name });
  };

  render() {
    const { t, payload, updatePayload, allAccounts } = this.props;
    const { currency } = payload;

    if (payload.erc20token) {
      return (
        <ERC20RenderName
          payload={payload}
          allAccounts={allAccounts}
          updatePayload={updatePayload}
        />
      );
    }

    if (!currency) return null;

    const AccountCurIcon = getCryptoCurrencyIcon(currency);
    return (
      <Box flow={20}>
        <Box>
          <ModalSubTitle noPadding>
            {t("newAccount:options.name")}
          </ModalSubTitle>
          <InputField
            dataTest="account_name"
            value={payload.name}
            autoFocus
            onChange={this.handleChangeName}
            {...inputProps}
            placeholder={t("newAccount:options.acc_name_placeholder")}
            renderLeft={
              AccountCurIcon ? (
                <AccountCurIcon color={currency.color} size={15} />
              ) : null
            }
          />
        </Box>
        <InfoBox type="info" withIcon>
          <Text i18nKey="accountCreation:steps.name.warning" />
        </InfoBox>
      </Box>
    );
  }
}

export default withStyles(styles)(translate()(AccountCreationOptions));
