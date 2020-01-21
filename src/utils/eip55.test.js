import * as eip55 from "utils/eip55";

describe("utils/eip55", () => {
  describe("toCheckSumAddress", () => {
    it("convert to checksum address", () => {
      expect(
        eip55.toCheckSumAddress("0x5ed8cee6b63b1c6afce3ad7c92f4fd7e1b8fad9f"),
      ).toBe("0x5eD8Cee6b63b1c6AFce3AD7c92f4fD7E1B8fAd9F");
    });
    it("does not convert an invalid address", () => {
      expect(eip55.toCheckSumAddress("abcde")).toBe("");
    });
  });

  describe("isChecksumAddress", () => {
    it("detect a checksum address", () => {
      expect(
        eip55.isChecksumAddress("0x5eD8Cee6b63b1c6AFce3AD7c92f4fD7E1B8fAd9F"),
      ).toBe(true);
    });
    it("detect a not-checksum address", () => {
      expect(
        eip55.isChecksumAddress("0x5ed8cee6b63b1c6afce3ad7c92f4fd7e1b8fad9f"),
      ).toBe(false);
    });
  });
});
