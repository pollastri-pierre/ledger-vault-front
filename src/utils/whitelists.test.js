import { getNumberOfAddressesChanged } from "utils/creationFlows";

describe("whitelist utils", () => {
  describe("getNumberOfAddressesChanged", () => {
    it("should return 0 if no changes", () => {
      const initialPayload = {
        name: "",
        description: "",
        addresses: [
          { id: 1, name: "btc", currency: "bitcoin", address: "fkdsfksdj" },
        ],
      };

      const payload = {
        name: "",
        description: "",
        addresses: [
          { id: 1, name: "btc", currency: "bitcoin", address: "fkdsfksdj" },
        ],
      };
      expect(getNumberOfAddressesChanged(initialPayload, payload)).toBe(0);
    });
    it("should return 1 if 1 added", () => {
      const initialPayload = {
        name: "",
        description: "",
        addresses: [],
      };

      const payload = {
        name: "",
        description: "",
        addresses: [
          { id: 1, name: "btc", currency: "bitcoin", address: "fkdsfksdj" },
        ],
      };
      expect(getNumberOfAddressesChanged(initialPayload, payload)).toBe(1);
    });
    it("should return 1 if 1 deleted", () => {
      const initialPayload = {
        name: "",
        description: "",
        addresses: [
          { id: 1, name: "btc", currency: "bitcoin", address: "fkdsfksdj" },
        ],
      };

      const payload = {
        name: "",
        description: "",
        addresses: [],
      };
      expect(getNumberOfAddressesChanged(initialPayload, payload)).toBe(1);
    });
    it("should handle both removing and editing", () => {
      const initialPayload = {
        name: "",
        description: "",
        addresses: [
          { id: 1, name: "btc1", currency: "bitcoin_1", address: "fkdsfksdj" },
          { id: 2, name: "btc2", currency: "bitcoin_2", address: "aaaa" },
          { id: 3, name: "btc3", currency: "bitcoin_3", address: "llll" },
          { id: 4, name: "btc4", currency: "bitcoin_4", address: "llllllllll" },
          { id: 5, name: "btc5", currency: "bitcoin_5", address: "dlldldlld" },
          { id: 6, name: "btc6", currency: "bitcoin_6", address: "llll" },
          { id: 7, name: "btc7", currency: "bitcoin_7", address: "lllsisl" },
          { id: 8, name: "btc8", currency: "bitcoin_8", address: "uuuuuuuu" },
        ],
      };

      const payload = {
        name: "",
        description: "",
        addresses: [
          { id: 1, name: "btc1", currency: "bitcoin_1", address: "fkdsfksdj" },
          { id: 2, name: "btc2", currency: "bitcoin_2", address: "aaaa" },
          { id: 3, name: "btc3", currency: "bitcoin_3", address: "llll" },
          { id: 4, name: "btc4", currency: "bitcoin_4", address: "llllllllll" },
          { id: 5, name: "btc5", currency: "edited", address: "edited" },
        ],
      };
      expect(getNumberOfAddressesChanged(initialPayload, payload)).toBe(4);
    });
    it("should handle adding", () => {
      const initialPayload = {
        name: "",
        description: "",
        addresses: [
          { id: 1, name: "btc1", currency: "bitcoin_1", address: "fkdsfksdj" },
          { id: 2, name: "btc2", currency: "bitcoin_2", address: "aaaa" },
        ],
      };

      const payload = {
        name: "",
        description: "",
        addresses: [
          { id: 1, name: "btc1", currency: "bitcoin_1", address: "fkdsfksdj" },
          { id: 2, name: "btc2", currency: "bitcoin_2", address: "aaaa" },
          { id: 3, name: "btc3", currency: "bitcoin_3", address: "llll" },
        ],
      };
      expect(getNumberOfAddressesChanged(initialPayload, payload)).toBe(1);
    });
    it("should handle both adding and editing", () => {
      const initialPayload = {
        name: "",
        description: "",
        addresses: [
          { id: 1, name: "btc1", currency: "bitcoin_1", address: "fkdsfksdj" },
          { id: 2, name: "btc2", currency: "bitcoin_2", address: "aaaa" },
        ],
      };

      const payload = {
        name: "",
        description: "",
        addresses: [
          { id: 1, name: "btc1", currency: "bitcoin_1", address: "fkdsfksdj" },
          { id: 2, name: "btc2", currency: "bitcoin_2", address: "edited" },
          { id: 3, name: "btc3", currency: "bitcoin_3", address: "llll" },
        ],
      };
      expect(getNumberOfAddressesChanged(initialPayload, payload)).toBe(2);
    });
  });
});
