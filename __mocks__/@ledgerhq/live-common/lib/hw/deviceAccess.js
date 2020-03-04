export const withDevicePolling = () => {
  const transport = {
    on: () => {},
    exchange: () => {},
  };
  return job => job(transport);
};
