import moxios from 'moxios';
import reducer from '../../redux/modules/alerts';
import { REMOVE_MESSAGE, closeMessage } from '../../redux/modules/alerts';

describe('Module messages', () => {
  it('closeMessage REMOVE_MESSAGE and id', () => {
    expect(closeMessage('id')).toEqual({
      type: REMOVE_MESSAGE,
      id: 'id'
    });
  });

  it('reducer should remove the messages ', () => {
    const state = [{id: 'ERROR1'}, {id: 'ERROR2'}];
    const action = {type: REMOVE_MESSAGE, id: 'ERROR1'};
    const stateReduced = [{id: 'ERROR2'}];

    expect(reducer(state, action)).toEqual(stateReduced);
  });

});


