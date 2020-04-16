import { getPages } from "./index";

describe("components/Paginator", () => {
  describe("getPages", () => {
    test("low amount of pages", () => {
      expect(getPages(2, 1, 5)).toEqual([1, 2]);
    });

    test("exact amount of pages", () => {
      expect(getPages(5, 1, 5)).toEqual([1, 2, 3, 4, 5]);
    });

    test("it should throw with odd maxDisplayed", () => {
      const fn = () => getPages(1, 1, 4);
      expect(fn).toThrow("Max displayed pages should be even");
    });

    test("basic scrolling", () => {
      const maxDisplayed = 5;
      const nbPages = 6;
      const t = (page, result) =>
        expect(getPages(nbPages, page, maxDisplayed)).toEqual(result);
      // < [1] 2  3  4  5  >
      // <  1 [2] 3  4  5  >
      // <  1  2 [3] 4  5  >
      // <  2  3 [4] 5  6  >
      // <  2  3  4 [5] 6  >
      // <  2  3  4  5 [6] >

      t(1, [1, 2, 3, 4, 5]);
      t(2, [1, 2, 3, 4, 5]);
      t(3, [1, 2, 3, 4, 5]);
      t(4, [2, 3, 4, 5, 6]);
      t(5, [2, 3, 4, 5, 6]);
      t(6, [2, 3, 4, 5, 6]);
    });

    test("scrolling with more pages just to be sure", () => {
      let expected;

      expected = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      expect(getPages(14, 1, 9)).toEqual(expected);

      expected = [2, 3, 4, 5, 6, 7, 8, 9, 10];
      // < 2  3  4  5  [6]  7  8  9  10 >
      expect(getPages(14, 6, 9)).toEqual(expected);
    });
  });
});
