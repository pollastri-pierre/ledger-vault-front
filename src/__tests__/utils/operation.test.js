import operationUtils from "../../redux/utils/operation";

const data = [
  {
    uuid: 1,
    name: "test"
  }
];

describe("Utils Operations", () => {
  it("getOperationDetails should return the operation details if exist", () => {
    expect(operationUtils.findOperationDetails(1, data)).toEqual({
      uuid: 1,
      name: "test"
    });
  });

  it("getOperationDetails should return undefined if it doesnt exist", () => {
    expect(operationUtils.findOperationDetails(2, data)).toBe(undefined);
  });
});
