import reducer, { UNBLUR_BG, BLUR_BG, blurBG, unblurBG} from '../../redux/modules/blurBG';

describe('Module blurBG', () => {
  it('reducer should set the blurredBG to 1', () => {
    const state = { blurredBG: 0};
    const action = {type: BLUR_BG};
    const stateReduced = { blurredBG: 1};

    expect(reducer(state, action)).toEqual(stateReduced);
  });

  it('reducer should leave the blurredBG to 1', () => {
    const state = { blurredBG: 1};
    const action = {type: BLUR_BG};
    const stateReduced = { blurredBG: 1};

    expect(reducer(state, action)).toEqual(stateReduced);
  });

  it('reducer should set the blurredBG to 1', () => {
    const state = { blurredBG: 1};
    const action = {type: UNBLUR_BG};
    const stateReduced = { blurredBG: 0};

    expect(reducer(state, action)).toEqual(stateReduced);
  });

  it('reducer should leave the blurredBG to 0', () => {
    const state = { blurredBG: 0};
    const action = {type: UNBLUR_BG};
    const stateReduced = { blurredBG: 0};

    expect(reducer(state, action)).toEqual(stateReduced);
  });

  it('blurBG() should send BLUR_BG', () => {
    expect(blurBG()).toEqual({
      type: BLUR_BG
    });
  });

  it('unblurBG() should send UNBLUR_BG', () => {
    expect(unblurBG()).toEqual({
      type: UNBLUR_BG
    });
  });

});

