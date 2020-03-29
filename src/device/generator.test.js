import uniq from "lodash/uniq";
import { generateSeeds, hashCode } from "device/generator";

describe("Generator seeds for speculos", () => {
  it("generateSeeds should generate different seeds", () => {
    const seeds = generateSeeds("my_salt_str", 50);
    expect(seeds.length).toBe(uniq(seeds).length);
  });

  it("hashCode should always return same hash", () => {
    const entropy = hashCode("my_salt_str");
    const entropy2 = hashCode("my_salt_str");
    const entropy3 = hashCode("my_salt_str");
    expect(entropy).toEqual(entropy2);
    expect(entropy).toEqual(entropy3);
  });
  it("hashCode should generate different hash code", () => {
    const hash1 = hashCode("mysalt");
    const hash2 = hashCode("Mysalt");
    const hash3 = hashCode("oysalt");
    const hash4 = hashCode("fysalt");
    expect(hash1).not.toEqual(hash2);
    expect(hash2).not.toEqual(hash3);
    expect(hash2).not.toEqual(hash4);
  });

  it("generateSeeds should be deterministic", () => {
    const firstGeneration = generateSeeds("my_entropy", 100);
    const secondGeneration = generateSeeds("my_entropy", 100);
    const thirdGeneration = generateSeeds("my_entropy", 100);
    expect(firstGeneration).toEqual(secondGeneration);
    expect(firstGeneration).toEqual(thirdGeneration);
  });
  it("generateSeeds should generate differents seeds with 2 different salt", () => {
    const firstGeneration = generateSeeds("myfssfsdfsdkh_salt", 32);
    const secondGeneration = generateSeeds(
      "meriflockspauolopopissssslslsllslsls",
      32,
    );
    expect(firstGeneration).not.toEqual(secondGeneration);
  });
});
