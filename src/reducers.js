import { combineReducers } from 'redux';
import isEmpty from 'lodash/isEmpty';
import { BLUR_BG, UNBLUR_BG, SET_CURRENT_USER, SET_REROUTE, SET_TEAM } from './actions';
import { ACTIVATE_TAB, PREVIOUS_TAB, NEXT_TAB, SAVE_TAB, ADD_TAB, EXIT_TABS, ADD_TABBAR } from './tabBarActions';

const initialState = {
  isAuthenticated: false,
  clearanceLevel: '',
  user: {},
};

const initialTabState = {
  tab: [],
  activeTab: -1,
};

const initialTabBarState = {
  tabBar: {},
};

function blurBG(state = { blurredBG: 0 }, action) {
  switch (action.type) {
    case BLUR_BG:
      return Object.assign({}, state, {
        blurredBG: state.blurredBG + 1,
      });

    case UNBLUR_BG:
      return Object.assign({}, state, {
        tabBar: (state.blurredBG > 0) ? (state.blurredBG - 1) : state.blurredBG,
      });
    default:
      return state;
  }
}

function auth(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      if ((!isEmpty(action.user) && !(action.user === 'undefined'))) {
        localStorage.setItem('clearanceLevel', 'all');
      } else {
        localStorage.setItem('team', '');
      }
      return Object.assign(
        {},
        state,
        {
          isAuthenticated: (!isEmpty(action.user) && !(action.user === 'undefined')),
          user: action.user,
          clearanceLevel: ((!isEmpty(action.user) && !(action.user === 'undefined')) ? 'all' : ''),
          team: ((!isEmpty(action.user) && !(action.user === 'undefined')) ? state.team : ''),
        },
      );

    case SET_TEAM:
      if ((!isEmpty(action.team) && !(action.team === 'undefined'))) {
        localStorage.setItem('team', action.team);
      } else {
        localStorage.setItem('team', '');
      }
      return Object.assign(
        {},
        state,
        {
          team: ((!isEmpty(action.team) && !(action.team === 'undefined')) ? action.team : ''),
        },
      );
    default:
      return state;
  }
}

function setReroute(state = { reroute: '/' }, action) {
  switch (action.type) {
    case SET_REROUTE:
      return Object.assign({}, state, {
        reroute: action.reroute,
      });
    default:
      return state;
  }
}

function manageTab(state = initialTabBarState, action) {
  switch (action.type) {
    case ADD_TABBAR:
      {
        const newTabBar = state.tabBar;
        newTabBar[action.id] = initialTabState;
        return Object.assign(
          {},
          state,
          {
            tabBar: newTabBar,
          },
        );
      }

    case SAVE_TAB: {
      console.log(action)
      if (state.tabBar[action.id].activeTab < 0) {
        return state;
      }
      const newTabBar = state.tabBar;
      newTabBar[action.id] = Object.assign({}, newTabBar[action.id],
        {
          tab: newTabBar[action.id].tab.map((item, index) => {
            if (index === action.index) {
              return Object.assign({}, item, { state: action.state });
            }
            return item;
          }),
        },
      );
      return Object.assign(
        {},
        state,
        {
          tabBar: newTabBar,
        },
      );
    }

    case ADD_TAB: {
      if (state.tabBar[action.id].tab.length > action.index) {
        return state;
      }
      console.log(JSON.stringify(state))
      const tabs = state.tabBar[action.id].tab;
      tabs.push({ state: {} });
      const newTabBar = state.tabBar;
      newTabBar[action.id] = Object.assign({}, newTabBar[action.id],
        {
          tab: tabs,
        });
      return Object.assign(
        {},
        state,
        {
          tabBar: newTabBar,
        },
      );
    }

    case ACTIVATE_TAB: {
      const newTabBar = state.tabBar;
      newTabBar[action.id] = Object.assign({}, newTabBar[action.id],
        {
          activeTab: action.index,
        });
      return Object.assign(
        {},
        state,
        {
          tabBar: newTabBar,
        },
      );
    }

    case NEXT_TAB: {
      const newTabBar = state.tabBar;
      newTabBar[action.id] = Object.assign({}, newTabBar[action.id],
        {
          activeTab: state.tabBar[action.id].activeTab + 1,
        });
      return Object.assign(
        {},
        state,
        {
          tabBar: newTabBar,
        },
      );
    }

    case PREVIOUS_TAB: {
      const newTabBar = state.tabBar;
      newTabBar[action.id] = Object.assign({}, newTabBar[action.id],
        {
          activeTab: state.tabBar[action.id].activeTab - 1,
        });
      return Object.assign(
        {},
        state,
        {
          tabBar: newTabBar,
        },
      );
    }

    default:
      return state;
  }
}

const reducers = combineReducers({
  blurBG,
  auth,
  setReroute,
  manageTab,
});

export default reducers;
