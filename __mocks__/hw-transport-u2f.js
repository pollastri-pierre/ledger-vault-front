export const mockCreate = jest.fn();

const mock = jest.fn().mockImplementation(() => {
  return {
    create: mockCreate
  };
});

export default mock;
