// @flow

import { useEffect, useState } from "react";
import { BigNumber } from "bignumber.js";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";

import { remapError } from "utils/errors";
import AccountCalculateFeeQuery from "api/queries/AccountCalculateFeeQuery";

import type { RestlayEnvironment } from "restlay/connectData";
import type { WalletBridge } from "bridge/types";
import type { Account } from "data/types";
import type { FeesQueryResponse } from "api/queries/AccountCalculateFeeQuery";

type UseFetchFeesProps<T, P> = {
  restlay: RestlayEnvironment,
  account: Account,
  transaction: T,
  bridge: WalletBridge<T>,
  onChangeTransaction: T => void,
  estimateFeesPayload: P,
  shouldFetchFees?: T => boolean,
  // the response type should be $Shape<T> but Flow doesn't agree (?)
  patchFromSuccess: (FeesQueryResponse, T) => T,
  patchFromError: (Error, T) => T,
};

function useFetchFees<
  T: {
    amount: BigNumber,
    recipient: string,
    // tried to better type but.. failed
    fees: Object,
  },
  P,
>(props: UseFetchFeesProps<T, P>) {
  const {
    restlay,
    account,
    transaction,
    onChangeTransaction,
    bridge,
    estimateFeesPayload,
    patchFromSuccess,
    patchFromError,
    shouldFetchFees,
  } = props;
  const [isFetching, setFetching] = useState(false);
  const [nonce, setNonce] = useState(0);

  const currency = getCryptoCurrencyById(account.currency);

  // used to force fees invalidation
  const incrementNonce = () => setNonce(nonce + 1);

  useEffect(() => {
    let unsub = false;

    const effect = async () => {
      if (shouldFetchFees && !shouldFetchFees(transaction)) return;

      // VFE-98: even if we don't fetch fees if amount is equal to 0,
      // we still want to invalidate any pending fees fetching, and
      // reset the loading state

      if (transaction.amount.isEqualTo(0)) {
        setFetching(false);
        return;
      }

      // let's not bother fetching fees if amount too high
      if (transaction.amount.isGreaterThan(account.balance)) {
        setFetching(false);
        return;
      }

      try {
        setFetching(true);

        const recipientError = await bridge.fetchRecipientError(
          restlay,
          currency,
          transaction.recipient,
        );

        if (recipientError) {
          setFetching(false);
          return;
        }

        const estimatedFees = await restlay.fetchQuery(
          new AccountCalculateFeeQuery({
            accountId: account.id,
            payload: estimateFeesPayload,
          }),
        );
        if (unsub) return;

        onChangeTransaction({
          ...transaction,
          ...patchFromSuccess(estimatedFees, transaction),
        });

        setFetching(false);
      } catch (err) {
        if (unsub) return;
        console.error(err); // eslint-disable-line no-console

        const error = remapError(err);

        setFetching(false);

        onChangeTransaction({
          ...transaction,
          ...patchFromError(error, transaction),
        });
      }
    };

    effect();

    return () => {
      unsub = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // FIXME can't put transaction as dependency, because it would cause infinite
    // loop with the fees fetching effect. solving this problem should be done
    // on higher level, putting tx in a reducer and alter it with actions
    //
    nonce,
    bridge,
    currency,
    account,
    restlay,
    estimateFeesPayload,
    shouldFetchFees,
  ]);

  return { isFetching, refresh: incrementNonce };
}

export default useFetchFees;
