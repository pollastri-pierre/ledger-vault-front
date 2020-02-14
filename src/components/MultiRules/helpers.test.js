import {
  convertEditDataIntoRules,
  extractGroupFromRule,
} from "components/MultiRules/helpers";

const USERS = [
  { id: 1, name: "name" },
  { id: 2, name: "name2" },
];
const GROUPS = [{ id: 1, name: "name", members: [] }];

describe("multirules/helpers", () => {
  describe("should return a group from AccountEditUsers/AccountEditGroup types", () => {
    it("should return a group from a AccountEditUsers type", () => {
      const initial = { quorum: 2, users: [1, 2] };
      expect(extractGroupFromRule(initial, USERS, GROUPS)).toEqual({
        is_internal: true,
        members: USERS,
      });
    });
    it("should return a group from AccountEditGroup type", () => {
      const initial = { quorum: 1, group_id: 1 };
      expect(extractGroupFromRule(initial, USERS, GROUPS)).toEqual(GROUPS[0]);
    });
    it("should a return a GovernanceRules type from GovernanceRulesInEditData type", () => {
      const rule1 = {
        name: "rule1",
        rules: [
          {
            type: "WHITELIST",
            data: [1],
          },
          {
            type: "MULTI_AUTHORIZATIONS",
            data: [
              { quorum: 1, users: [1, 2] },
              { quorum: 1, group_id: 1 },
            ],
          },
        ],
      };
      const initial = [rule1];
      const expected = [
        {
          name: "rule1",
          rules: [
            {
              type: "WHITELIST",
              data: [1],
            },
            {
              type: "MULTI_AUTHORIZATIONS",
              data: [
                { quorum: 1, group: { is_internal: true, members: USERS } },
                { quorum: 1, group: GROUPS[0] },
              ],
            },
          ],
        },
      ];
      expect(convertEditDataIntoRules(initial, USERS, GROUPS)).toEqual(
        expected,
      );
    });
  });
});
