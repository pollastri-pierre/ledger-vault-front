// @flow
export const SWITCH_LANG = "SWITCH_LANG";

export type Store = string;

export function switchLang(lang: string) {
  return { type: SWITCH_LANG, lang };
}

export function switchLocale() {
  return (dispatch: Function, getState: Function) => {
    const { locale } = getState();
    let nLang = "fr";

    if (locale === "fr") {
      nLang = "en";
    } else {
      nLang = "fr";
    }
    window.localStorage.setItem("locale", nLang);
    dispatch(switchLang(nLang));
  };
}

const initialState = "en";

export default function reducer(state: Store = initialState, action: Object) {
  switch (action.type) {
    case SWITCH_LANG:
      return action.lang;
    default:
      return state;
  }
}
