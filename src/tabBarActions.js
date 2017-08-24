export const ACTIVATE_TAB = 'ACTIVATE_TAB';
export const ADD_TAB = 'ADD_TAB';
export const ADD_TABBAR = 'ADD_TABBAR';
export const CLEAN_TABBAR = 'CLEAN_TABBAR';
export const SAVE_TAB = 'SAVE_TAB';
export const NEXT_TAB = 'NEXT_TAB';
export const PREVIOUS_TAB = 'PREVIOUS_TAB';
export const EXIT_TABS = 'EXIT_TABS';
export const VALIDATE_TAB = 'VALIDATE_TAB';

// Blur background action


export function addTab(index, id) {
  return {
    type: ADD_TAB,
    index,
    id,
  };
}

export function addTabBar(id) {
  return {
    type: ADD_TABBAR,
    id,
  };
}

export function cleanTabBar(id) {
  return {
    type: CLEAN_TABBAR,
    id,
  };
}

export function save(state, index, id) {
  return {
    type: SAVE_TAB,
    state,
    index,
    id,
  };
}

export function activateTab(index, id) {
  return {
    type: ACTIVATE_TAB,
    index,
    id,
  };
}

export function nextTab(id) {
  return {
    type: NEXT_TAB,
    id,
  };
}

export function previousTab(id) {
  return {
    type: PREVIOUS_TAB,
    id,
  };
}

export function exitTabs(id) {
  return {
    type: ADD_TABBAR,
    id,
  };
}

export function validate(id) {
  return {
    type: VALIDATE_TAB,
    id,
  };
}

