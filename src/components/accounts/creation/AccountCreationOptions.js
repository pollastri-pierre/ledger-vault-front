//@flow
import React from "react";
import BadgeCurrency from "../../BadgeCurrency";
import type { Currency } from "../../../data/types";

function AccountCreationOptions(props: {
  currency: Currency,
  name: string,
  changeName: Function
}) {
  return (
    <div className="account-creation-options">
      <label htmlFor="name">Name</label>
      <BadgeCurrency currency={props.currency} />
      <input
        type="text"
        name="name"
        placeholder="Account's name"
        value={props.name}
        onChange={e => props.changeName(e.target.value)}
      />
    </div>
  );
}

export default AccountCreationOptions;
