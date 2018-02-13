export const mockCreate = jest.fn();

// const mock = jest.fn().mockImplementation(() => {
//   return {
//     create: mockCreate
//   };
// });

const mock = () => ({
  create: jest.fn()
});

export default mock;
