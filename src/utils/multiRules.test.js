// @flow

/* eslint-disable import/extensions */
// FIXME for no reason jest can't handle normal import, so forced
// to import like this:
import BigNumber from "bignumber.js/bignumber.js";
/* eslint-enable import/extensions */

import { getMatchingRulesSet } from "./multiRules";

const user = {
  id: 1,
  entityType: "USER",
  pub_key: "",
  username: "",
  created_on: new Date().toString(),
  status: "ACTIVE",
  role: "ADMIN",
};

const WHITELISTS = {
  WHITELIST_1: {
    id: 1,
    name: "Whitelist 1",
    entityType: "WHITELIST",
    description: "",
    created_on: new Date().toString(),
    created_by: user,
    approvals: [],
    status: "ACTIVE",
    addresses: [
      {
        id: 1,
        name: "address 1",
        currency: "bitcoin",
        address: "abcde",
      },
    ],
  },
  WHITELIST_2: {
    id: 2,
    name: "Whitelist 2",
    entityType: "WHITELIST",
    description: "",
    created_on: new Date().toString(),
    created_by: user,
    approvals: [],
    status: "ACTIVE",
    addresses: [
      {
        id: 1,
        name: "Coinbase",
        currency: "ethereum",
        address: "abcde",
      },
    ],
  },
};

const RULES = {
  ONLY_AUTH: {
    name: "Rule 1",
    rules: [{ type: "MULTI_AUTHORIZATIONS", data: [{ quorum: 1, group: {} }] }],
  },
  MULTI_AUTH_NOT_IN_FIRST_STEP: {
    name: "Rule 1",
    rules: [
      { type: "MULTI_AUTHORIZATIONS", data: [null, { quorum: 1, group: {} }] },
    ],
  },
  THRESHOLD_1: {
    name: "With threshold 0 < amount < 20",
    rules: [
      { type: "THRESHOLD", data: [{ min: BigNumber(0), max: BigNumber(20) }] },
      { type: "MULTI_AUTHORIZATIONS", data: [{ quorum: 1, group: {} }] },
    ],
  },
  THRESHOLD_2: {
    name: "With threshold 10 < amount < Infinity",
    rules: [
      { type: "THRESHOLD", data: [{ min: BigNumber(10), max: null }] },
      { type: "MULTI_AUTHORIZATIONS", data: [{ quorum: 1, group: {} }] },
    ],
  },
  WHITELIST_1: {
    name: "With a whitelist",
    rules: [
      { type: "WHITELIST", data: [WHITELISTS.WHITELIST_1] },
      { type: "MULTI_AUTHORIZATIONS", data: [{ quorum: 1, group: {} }] },
    ],
  },
  WHITELIST_AND_THRESHOLD: {
    name: "With whitelist AND threshold",
    rules: [
      { type: "WHITELIST", data: [WHITELISTS.WHITELIST_1] },
      { type: "THRESHOLD", data: [{ min: BigNumber(0), max: BigNumber(20) }] },
      { type: "MULTI_AUTHORIZATIONS", data: [{ quorum: 1, group: {} }] },
    ],
  },
  WHITELIST_AND_THRESHOLD_2: {
    name: "With whitelist AND threshold, but different",
    rules: [
      { type: "WHITELIST", data: [WHITELISTS.WHITELIST_2] },
      { type: "THRESHOLD", data: [{ min: BigNumber(0), max: BigNumber(20) }] },
      { type: "MULTI_AUTHORIZATIONS", data: [{ quorum: 1, group: {} }] },
    ],
  },
};

describe("multiRules", () => {
  describe("getMatchingRulesSet", () => {
    describe("not on first approval step", () => {
      test("it should return null if op is not in first step", () => {
        const governanceRules = [RULES.MULTI_AUTH_NOT_IN_FIRST_STEP];
        const input = {
          transaction: {
            amount: BigNumber(10),
            recipient: "abcde",
            currency: "bitcoin",
          },
          governanceRules,
        };
        const set = getMatchingRulesSet(input);
        expect(set).toBe(null);
      });
      test("it should return the second rule if op is not in first step", () => {
        const governanceRules = [
          RULES.MULTI_AUTH_NOT_IN_FIRST_STEP,
          RULES.ONLY_AUTH,
        ];
        const input = {
          transaction: {
            amount: BigNumber(10),
            recipient: "abcde",
            currency: "bitcoin",
          },
          governanceRules,
        };
        const set = getMatchingRulesSet(input);
        expect(set).toBe(governanceRules[1]);
      });
    });
    describe("no condition", () => {
      test("should return the first set if no condition on it", () => {
        const governanceRules = [RULES.ONLY_AUTH, RULES.THRESHOLD_1];
        const input = {
          transaction: {
            amount: BigNumber(10),
            recipient: "abcde",
            currency: "bitcoin",
          },
          governanceRules,
        };
        const set = getMatchingRulesSet(input);
        expect(set).toBe(governanceRules[0]);
      });
    });

    describe("only threshold", () => {
      test("should match set with threshold", () => {
        const governanceRules = [RULES.THRESHOLD_1];
        const input = {
          transaction: {
            amount: BigNumber(5),
            recipient: "abcde",
            currency: "bitcoin",
          },
          governanceRules,
        };
        const set = getMatchingRulesSet(input);
        expect(set).toBe(governanceRules[0]);
      });
      test("should match nothing if outside of threshold", () => {
        const governanceRules = [RULES.THRESHOLD_1];
        const input = {
          transaction: {
            amount: BigNumber(21),
            recipient: "abcde",
            currency: "bitcoin",
          },
          governanceRules,
        };
        const set = getMatchingRulesSet(input);
        expect(set).toBe(null);
      });
      test("should match threshold among multiple rules sets", () => {
        const governanceRules = [RULES.THRESHOLD_1, RULES.THRESHOLD_2];
        const input = {
          transaction: {
            amount: BigNumber(21),
            recipient: "abcde",
            currency: "bitcoin",
          },
          governanceRules,
        };
        const set = getMatchingRulesSet(input);
        expect(set).toBe(governanceRules[1]);
      });
    });

    describe("only whitelist", () => {
      it("should match when recipient inside whitelist", () => {
        const governanceRules = [RULES.WHITELIST_1];
        const input = {
          transaction: {
            amount: BigNumber(1),
            recipient: "abcde",
            currency: "bitcoin",
          },
          governanceRules,
        };
        const set = getMatchingRulesSet(input);
        expect(set).toBe(governanceRules[0]);
      });
      it("should not match when recipient outside whitelist", () => {
        const governanceRules = [RULES.WHITELIST_1];
        const input = {
          transaction: {
            amount: BigNumber(1),
            recipient: "coco",
            currency: "bitcoin",
          },
          governanceRules,
        };
        const set = getMatchingRulesSet(input);
        expect(set).toBe(null);
      });
    });

    describe("whitelist + threshold", () => {
      it("should match when both whitelist & threshold match", () => {
        const governanceRules = [RULES.WHITELIST_AND_THRESHOLD];
        const input = {
          transaction: {
            amount: BigNumber(1),
            recipient: "abcde",
            currency: "bitcoin",
          },
          governanceRules,
        };
        const set = getMatchingRulesSet(input);
        expect(set).toBe(governanceRules[0]);
      });
      it("should not match when only threshold matches", () => {
        const governanceRules = [RULES.WHITELIST_AND_THRESHOLD];
        const input = {
          transaction: {
            amount: BigNumber(1),
            recipient: "coco",
            currency: "bitcoin",
          },
          governanceRules,
        };
        const set = getMatchingRulesSet(input);
        expect(set).toBe(null);
      });
      it("should not match when only whitelist matches", () => {
        const governanceRules = [RULES.WHITELIST_AND_THRESHOLD];
        const input = {
          transaction: {
            amount: BigNumber(100),
            recipient: "abcde",
            currency: "bitcoin",
          },
          governanceRules,
        };
        const set = getMatchingRulesSet(input);
        expect(set).toBe(null);
      });
      it("should select the correct set based on whitelist + threshold", () => {
        const governanceRules = [
          RULES.WHITELIST_AND_THRESHOLD_2,
          RULES.WHITELIST_AND_THRESHOLD,
        ];
        const input = {
          transaction: {
            amount: BigNumber(10),
            recipient: "abcde",
            currency: "bitcoin",
          },
          governanceRules,
        };
        const set = getMatchingRulesSet(input);
        expect(set).toBe(governanceRules[1]);
      });
    });
  });
});
