// import URL from "url";
import { denormalize } from "normalizr-gre";
import mockEntities from "./mock-entities";
import schema from "./schema";

const mockSync = (uri, method) => {
  // const q = URL.parse(uri, true);

  if (method === "GET") {
    switch (uri) {
      case "/accounts-mocks": {
        return denormalize(
          Object.keys(mockEntities.accounts),
          [schema.Account],
          mockEntities
        );
      }
      case "/groups-mocks": {
        return denormalize(
          Object.keys(mockEntities.groups),
          [schema.Group],
          mockEntities
        );
      }
      case "/people-mocks/admin": {
        return denormalize(
          Object.keys(mockEntities.members),
          [schema.Member],
          mockEntities
        ).filter(m => m.role === "admin");
      }
      case "/people-mocks/operator": {
        return denormalize(
          Object.keys(mockEntities.members),
          [schema.Member],
          mockEntities
        ).filter(m => m.role === "operator");
      }
      default:
    }
    // GET /group-mock/:id
    const m = /^\/group-mock\/([^/]+)$/.exec(uri);
    if (m) {
      const group = mockEntities.groups[m[1]];
      return denormalize(group.id, schema.Group, mockEntities);
    }

    const n = /^\/member-mock\/([^/]+)$/.exec(uri);
    if (n) {
      const member = mockEntities.members[n[1]];
      return denormalize(member.id, schema.Member, mockEntities);
    }
  }
};

const delay = ms => new Promise(success => setTimeout(success, ms));

export default (uri, init) => {
  const method = typeof init.method === "string" ? init.method : "GET";
  const body = typeof init.body === "string" ? JSON.parse(init.body) : null;
  const mockRes = mockSync(uri, method, body);
  if (mockRes) {
    return delay(300 + 800 * Math.random())
      .then(() => {
        console.warn(`mock: ${method} ${uri}`, body || "", "\n=>", mockRes);
        // if (Math.random() < 0.3) throw new Error("MOCK_HTTP_FAILURE");
        return {
          status: 200,
          json: () => Promise.resolve(mockRes)
        };
      })
      .catch(e => {
        console.warn(`mock: ${method} ${uri} FAILED`, e);
        throw e;
      });
  }
  return null;
};
