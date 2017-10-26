//@flow
import { schema, normalize } from 'normalizr';

// The schema defines how entities connect to each other
// this define the front model schema, not exactly the one coming from the API (without the _id fields)

export const currency = new schema.Entity(
  'currencies',
  {},
  {
    idAttribute: 'name'
  }
);

export const account = new schema.Entity('accounts', { currency });

export const operation = new schema.Entity(
  'operations',
  { account },
  {
    processStrategy: ({ account_id, ...entity }) => ({
      ...entity,
      account: account_id
    })
  }
);

export const group = new schema.Entity('groups');

export const member = new schema.Entity('members', {
  groups: [group]
});

group.define({
  members: [member]
});
