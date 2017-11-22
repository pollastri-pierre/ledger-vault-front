//@flow
import React, { Component } from "react";
import connectData from "../../restlay/connectData";
import Card from "../../components/Card";
import AccountQuery from "../../api/queries/AccountQuery";
import TryAgain from "../../components/TryAgain";
import SpinnerCard from "../../components/spinners/SpinnerCard";
import type { Account } from "../../data/types";
import QRCode from "../../components/QRCode";

type Props = {
  account: Account,
  accountId: string
};

class ReceiveFundsCard extends Component<Props> {
  render() {
    const { account } = this.props;
    const hash = account.receive_address;
    return (
      <Card className="funds" title="Receive Funds">
        <QRCode hash={hash} size={100} />
        <div className="right">
          <h4>current address</h4>
          <p className="hash">{hash}</p>
          <p className="info">
            A new address is generated when a first payment is received on the
            current address. Previous addresses remain valid and do not expire.
          </p>
        </div>
      </Card>
    );
  }
}

const RenderError = ({ error, restlay }: *) => (
  <Card className="funds" title="Receive funds">
    <TryAgain error={error} action={restlay.forceFetch} />
  </Card>
);

const RenderLoading = () => (
  <Card className="funds" title="Receive funds">
    <SpinnerCard />
  </Card>
);

export default connectData(ReceiveFundsCard, {
  queries: {
    account: AccountQuery
  },
  propsToQueryParams: ({ accountId }: { accountId: string }) => ({ accountId }),
  optimisticRendering: true,
  RenderError,
  RenderLoading
});
