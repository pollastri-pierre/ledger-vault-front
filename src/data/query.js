//@flow
import mockAPI from './mock-api';

const delay = ms => new Promise(success => setTimeout(success, ms));

export default (params: *): Promise<Object> =>
  delay(400 + 400 * Math.random()).then(() => {
    const { id } = params;
    const getter = mockAPI[id];
    if (!getter) throw new Error('no mock defined for id=' + id);
    return getter(params);
  });
