import operationUtils from '../../redux/utils/operation';


const data = [{
  uuid: 1,
  details: {
    uuid: 1,
    name: 'test',
  },
}];

describe('Utils Operations', () => {
  it('getOperationDetails should return the operation details if exist', () => {
    expect(operationUtils.findOperationDetails(1, data)).toEqual({
      uuid: 1,
      name: 'test',
    });
  });

  it('getOperationDetails should return the null if it doesnt exist', () => {
    expect(operationUtils.findOperationDetails(2, data)).toBe(null);
  });

  it('getOperationDetails should return the null if it exists but not in detail', () => {
    const operations = [{ uuid: 1 }];
    expect(operationUtils.findOperationDetails(1, operations)).toBe(null);
  });
});
