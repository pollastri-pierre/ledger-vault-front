// @flow

import type { User } from "data/types";
//
//                          CLOSING THE MODAL. Vast subject.
//   \
//    '-.__.-'              After multiple iterations, it appears that a
//    /oo |--.--,--,--.     little "customized" behaviour can work better
//    \_.-'._i__i__i_.'     than an abstraction factory that discover more
//          """""""""       and more bugging cases. Here it is:

const modalsRoutes = [
  /(.*)\/send$/,
  /(.*)\/accounts\/new$/,
  /(.*)\/receive$/,
  /(.*)\/admin-rules$/,
  /(.*)\/new$/,
  /(.*)\/edit\/[0-9]+/,
  /(.*)\/details\/[0-9]+\/.+$/,
];

const deepModalRoutes = [
  {
    regex: /(.*)\/tasks\/(.*)\/new/,
    redirect: (id: ?string, me: User) =>
      `/${
        window.location.pathname.split("/")[1]
      }/${me.role.toLowerCase()}/tasks`,
    regexId: null,
  },
  {
    regex: /(.*)\/tasks\/(.*)\/details\/.+$/,
    redirect: (id: ?string, me: User) =>
      `/${
        window.location.pathname.split("/")[1]
      }/${me.role.toLowerCase()}/tasks`,
    regexId: null,
  },
  {
    regex: /(.*)\/accounts\/view\/[0-9]+\/.+$/,
    redirect: (id: ?string, me: User) =>
      id &&
      `/${
        window.location.pathname.split("/")[1]
      }/${me.role.toLowerCase()}/accounts/view/${id}`,
    regexId: /\/accounts\/view\/[0-9]+/,
  },
];

export function getModalClosePath(p: string, me: User) {
  let regularMatch;
  let nestedMatch;

  // using find allow to stop parcourir the array when first match
  modalsRoutes.find(regex => {
    regularMatch = p.match(regex);
    return regularMatch;
  });

  deepModalRoutes.find(({ regex, redirect, regexId }) => {
    const match = p.match(regex);
    if (match) {
      const subStringId = regexId && p.match(regexId);
      const matchId = subStringId && subStringId[0].match(/\d+/g);
      const id = matchId && matchId[0];
      nestedMatch = redirect(id, me);
      return true;
    }
    return false;
  });

  if (nestedMatch) {
    return nestedMatch;
  }
  return regularMatch ? regularMatch[1] : null;
}
