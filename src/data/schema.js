//@flow
import { schema } from 'normalizr';

// The schema defines how entities connect to each other
// this define the front model schema, not exactly the one coming from the API (without the _id fields)

export const Currency = new schema.Entity(
  'currencies',
  {},
  {
    idAttribute: 'name'
  }
);

export const Account = new schema.Entity('accounts', { currency: Currency });

export const Operation = new schema.Entity(
  'operations',
  { account: Account, currency: Currency },
  {
    idAttribute: 'uuid',
    processStrategy: ({ account_id, ...entity }) => ({
      ...entity,
      // NB this is to reconnect a disconnected model.
      // that means it will suppose account_id is already loaded.
      // we need to do smart loading system for that.
      account: account_id,
      currency: entity.currency_name
    })
  }
);

export const Group = new schema.Entity('groups');

export const Member = new schema.Entity('members', {
  groups: [Group]
});

Group.define({
  members: [Member]
});
