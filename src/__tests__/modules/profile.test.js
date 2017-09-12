import moxios from 'moxios';
import reducer, { API_URL, START_FETCHING, GOT_PROFILE, startFetch, gotProfile, fetchProfile } from '../../redux/modules/profile';

describe('Module profile', () => {
  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('reducer should set loading to false when it receives START_FETCHING', () => {
    const state = {results: null, loading: false};
    const action = {type: START_FETCHING};
    const stateReduced = {results: null, loading: true};

    expect(reducer(state, action)).toEqual(stateReduced);
  });

  it('reducer should set the result and loading to false when it receives GOT_PROFILE', () => {
    const state = {results: null, loading: true};
    const action = {type: GOT_PROFILE, results: [{id: '1'}]};
    const stateReduced = {results: [{id: '1'}], loading: false};

    expect(reducer(state, action)).toEqual(stateReduced);
  });
  it('startFetch() should send START_FETCHING', () => {
    expect(startFetch()).toEqual({
      type: START_FETCHING
    });
  });

  it('gotProfile() should send GOT_PROFILE and results', () => {
    const results = [{ id: '1' }];

    expect(gotProfile(results)).toEqual({
      type: GOT_PROFILE,
      results: results
    });

  });
  
  it('fetchProfile() should dispatch startFetch and gotResult once the promise succeed', (done) => {
    const dispatch = jest.fn();
    const thunk = fetchProfile();

    const mockResult = {
      data: {
        results: [{id: '1'}]
      }
    };

    const data = {
      results: [{id: '1'}]
    };

    thunk(dispatch);

    moxios.wait(() => {
      let request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: data
      }).then(() => {
        const calls = dispatch.mock.calls;
        expect(calls[0][0]).toEqual({type: START_FETCHING});
        expect(calls[1][0]).toEqual({type: GOT_PROFILE, results: data.results});
        done();
      });
    });

  });

  it('reducer should set loading to false when it receives START_FETCHING', () => {
    const state = {results: null, loading: false};
    const action = {type: START_FETCHING};
    const stateReduced = {results: null, loading: true};

    expect(reducer(state, action)).toEqual(stateReduced);
  });

  it('reducer should set the result and loading to false when it receives GOT_PROFILE', () => {
    const state = {results: null, loading: true};
    const action = {type: GOT_PROFILE, results: [{id: '1'}]};
    const stateReduced = {results: [{id: '1'}], loading: false};

    expect(reducer(state, action)).toEqual(stateReduced);
  });


});

