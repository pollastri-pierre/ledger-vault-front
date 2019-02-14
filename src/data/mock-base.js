export const member = {
  id: 5,
  key_handle:
    "000000000000000000000000000000000000000000000000000000000000000051cecd3760ba7f5b56e08f8b77e63e777065a3f055ab76faf35a601e7d18f58e",
  pub_key:
    "04A4A863A431732CDC3AF2047EB4DA69314C88EFA7F0C4F0C32976B9BF0EE776298B103DC316EE3DBA2363A008AA38FE86E535D77A26C9A9FF5424E14322915762",
  username: "user1"
};

export const group = {
  id: 1,
  name: "group A",
  description: "short description of the group",
  created_on: new Date(),
  status: "APPROVED",
  members: []
};

export const account = {
  account_type: "Bitcoin",
  address: null,
  approvals: [
    {
      created_on: '"2019-01-24T10:47:50.969535+00:00"',
      person: {
        email: "user2@ledger.fr",
        id: 6,
        key_handle:
          "000000000000000000000000000000000000000000000000000000000000000070285ac47c2a8fbf1bdc5bb7fdb632991d688634dab45bb53da58447c685495a",
        picture: "",
        pub_key:
          "041D783B5B3DA70087771BD84A089860642CB98135CDC8794F3A41B49DCAADF20010F2CBB3145FED78C7481372ECA07315A1977C0EA5D4A308CEE048A7F25597EC",
        username: "user2"
      },
      type: "APPROVE"
    },
    {
      created_on: '"2019-01-24T10:47:33.466106+00:00"',
      person: {
        email: "user1@user.com",
        id: 5,
        key_handle:
          "000000000000000000000000000000000000000000000000000000000000000051cecd3760ba7f5b56e08f8b77e63e777065a3f055ab76faf35a601e7d18f58e",
        picture: "",
        pub_key:
          "04A4A863A431732CDC3AF2047EB4DA69314C88EFA7F0C4F0C32976B9BF0EE776298B103DC316EE3DBA2363A008AA38FE86E535D77A26C9A9FF5424E14322915762",
        username: "user1"
      },
      type: "APPROVE"
    }
  ],
  balance: 128644,
  contract_address: null,
  created_on: "2019-01-24T10:47:21.846254+00:00",
  creator: {
    email: "user1@user.com",
    id: 5,
    key_handle:
      "000000000000000000000000000000000000000000000000000000000000000051cecd3760ba7f5b56e08f8b77e63e777065a3f055ab76faf35a601e7d18f58e",
    picture: "",
    pub_key:
      "04A4A863A431732CDC3AF2047EB4DA69314C88EFA7F0C4F0C32976B9BF0EE776298B103DC316EE3DBA2363A008AA38FE86E535D77A26C9A9FF5424E14322915762",
    username: "user1"
  },
  currency_id: "bitcoin",
  fresh_addresses: [
    {
      address: "1MfeDvj5AUBG4xVMrx1xPgmYdXQrzHtW5b",
      derivation_path: "0/2"
    }
  ],
  id: 999,
  index: 0,
  is_hsm_coin_app_updated: true,
  members: [
    {
      email: "user1@user.com",
      id: 5,
      key_handle:
        "000000000000000000000000000000000000000000000000000000000000000051cecd3760ba7f5b56e08f8b77e63e777065a3f055ab76faf35a601e7d18f58e",
      picture: "",
      pub_key:
        "04A4A863A431732CDC3AF2047EB4DA69314C88EFA7F0C4F0C32976B9BF0EE776298B103DC316EE3DBA2363A008AA38FE86E535D77A26C9A9FF5424E14322915762",
      username: "user1"
    },
    {
      email: "user2@ledger.fr",
      id: 6,
      key_handle:
        "000000000000000000000000000000000000000000000000000000000000000070285ac47c2a8fbf1bdc5bb7fdb632991d688634dab45bb53da58447c685495a",
      picture: "",
      pub_key:
        "041D783B5B3DA70087771BD84A089860642CB98135CDC8794F3A41B49DCAADF20010F2CBB3145FED78C7481372ECA07315A1977C0EA5D4A308CEE048A7F25597EC",
      username: "user2"
    },
    {
      email: "user3@ledger.fr",
      id: 7,
      key_handle:
        "00000000000000000000000000000000000000000000000000000000000000004d7612ffa8e231910f7ce8c26190f8ee1672ca29696e8c0119bc9a7690b98d2f",
      picture: "",
      pub_key:
        "047F2ACCB0B06F77F98D37B358062CA2E17E042C48EC3D58355A52CF086BFA27C7E80B18D18283537D595DC96438CAC1943AA5DFDBF6DB079BCD68EBD3D2D32670",
      username: "user3"
    }
  ],
  name: "btc",
  number_of_approvals: 2,
  parent_id: null,
  security_scheme: {
    quorum: 2,
    rate_limiter: {
      max_transaction: null,
      time_slot: null
    },
    time_lock: null
  },
  settings: {
    blockchain_explorer: "blockchain.info",
    currency_unit: {
      code: "BTC",
      id: 4,
      magnitude: 8,
      name: "bitcoin",
      symbol: "\u0243"
    },
    fiat: {
      confirmation_needed: 0,
      id: 1,
      issue_message: null,
      name: "Euro",
      type: "FIAT"
    },
    person_id: 5
  },
  status: "APPROVED"
};
