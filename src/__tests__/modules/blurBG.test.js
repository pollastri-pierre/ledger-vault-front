import reducer from '../../redux/modules/blurBG';

import { GET_OPERATION_START, OPERATION_CLOSE } from '../../redux/modules/operations';

describe('Module blurBG', () => {
  it('should set blurredBG when GET_OPERATION_START', () => {
    expect(reducer({ blurredBG: 0 }, { type: GET_OPERATION_START })).toEqual({ blurredBG: 1 });
  });

  it('should unset blurredBG when OPERATION_CLOSE', () => {
    expect(reducer({ blurredBG: 1 }, { type: OPERATION_CLOSE })).toEqual({ blurredBG: 0 });
  });
});

