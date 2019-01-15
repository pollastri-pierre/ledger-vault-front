// @flow

import React, { Fragment } from "react";
import { translate, Interpolate } from "react-i18next";

import type { State as AccountCreationState } from "redux/modules/account-creation";

import type { Translate } from "data/types";
import { BigSecurityMembersIcon } from "../../icons";

import LineRow from "../../LineRow";
import BadgeSecurity from "../../BadgeSecurity";
import AccountName from "../../AccountName";
import InfoModal from "../../InfoModal";

type Props = {
  accountCreationState: AccountCreationState,
  t: Translate
};

const bigSecurityMembersIcon = <BigSecurityMembersIcon />;

function AccountCreationConfirmation(props: Props) {
  const { t, accountCreationState } = props;
  const { currency, erc20token, approvers, quorum } = accountCreationState;

  return (
    <div>
      <div style={{ textAlign: "center" }}>
        <BadgeSecurity
          icon={bigSecurityMembersIcon}
          label="Members"
          value={`${approvers.length} selected`}
        />
      </div>

      <div style={{ marginTop: "50px" }}>
        {currency && (
          <LineRow label="account">
            <AccountName
              name={accountCreationState.name}
              currencyId={currency.id}
            />
          </LineRow>
        )}
        {erc20token && (
          <Fragment>
            <LineRow label="token account">{accountCreationState.name}</LineRow>
            {accountCreationState.parent_account &&
              accountCreationState.parent_account.name && (
                <LineRow label="parent account">
                  {accountCreationState.parent_account.name}
                </LineRow>
              )}
          </Fragment>
        )}
        {currency && (
          <LineRow label="Currency">
            <span className="info-value currency">{currency.name}</span>
          </LineRow>
        )}
        <LineRow label={t("newAccount:confirmation.approvals")}>
          <Interpolate
            i18nKey="newAccount:confirmation.approvals_members"
            count={quorum}
            total={approvers.length}
          />
        </LineRow>
      </div>
      <div style={{ marginTop: "50px" }}>
        <InfoModal className="confirmation-explain">
          {t("newAccount:confirmation.desc")}
        </InfoModal>
      </div>
    </div>
  );
}

export default translate()(AccountCreationConfirmation);
