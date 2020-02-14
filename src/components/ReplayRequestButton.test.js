import { getUrlFromRequest } from "components/ReplayRequestButton";

const orgaName = "ledger1";

describe("ReplayRequestButton", () => {
  const { location } = window;

  beforeAll(() => {
    delete window.location;
    window.location = { pathname: `/${orgaName}` };
  });
  afterAll(() => {
    window.location = location;
  });

  describe("getUrlFromRequest method", () => {
    it("should work for create account from account page", () => {
      const path = `/${orgaName}/admin/accounts/view/3/accounts/details/3/history`;
      const me = { role: "ADMIN" };
      const request = {
        type: "CREATE",
        entity: {
          id: 1,
          name: "account",
          entityType: "ACCOUNT",
        },
      };

      const expected = `/${orgaName}/admin/accounts/view/3/accounts/new`;

      expect(getUrlFromRequest(request, path, me)).toBe(expected);
    });
    it("should work for create account from accounts list", () => {
      const path = `/${orgaName}/admin/accounts/details/1/history`;
      const me = { role: "ADMIN" };
      const request = {
        type: "EDIT",
        entity: {
          id: 1,
          name: "account",
          entityType: "ACCOUNT",
        },
        edit_data: { name: "account2" },
      };

      const expected = `/${orgaName}/admin/accounts/edit/1`;

      expect(getUrlFromRequest(request, path, me)).toBe(expected);
    });
    it("should work for edit account from tasks list", () => {
      const path = `/${orgaName}/admin/tasks/accounts/details/1/history`;
      const me = { role: "ADMIN" };
      const request = {
        type: "EDIT",
        entity: {
          id: 1,
          name: "account",
          entityType: "ACCOUNT",
        },
        edit_data: { name: "account2" },
      };

      const expected = `/${orgaName}/admin/tasks/accounts/edit/1`;

      expect(getUrlFromRequest(request, path, me)).toBe(expected);
    });
    it("should work for create group from groups list", () => {
      const path = `/${orgaName}/admin/groups/details/1/history`;
      const me = { role: "ADMIN" };
      const request = {
        type: "EDIT",
        entity: {
          id: 1,
          name: "groupo",
          entityType: "GROUP",
        },
        edit_data: {
          name: "group",
        },
      };

      const expected = `/${orgaName}/admin/groups/edit/1`;

      expect(getUrlFromRequest(request, path, me)).toBe(expected);
    });
    it("should work for create group from tasks list", () => {
      const path = `/${orgaName}/admin/tasks/groups/details/1/history`;
      const me = { role: "ADMIN" };
      const request = {
        type: "CREATE",
        entity: {
          id: 1,
          name: "groupo",
          entityType: "GROUP",
        },
      };

      const expected = `/${orgaName}/admin/tasks/groups/new`;

      expect(getUrlFromRequest(request, path, me)).toBe(expected);
    });
    it("should work for create group from groups list", () => {
      const path = `/${orgaName}/admin/groups/details/1/history`;
      const me = { role: "ADMIN" };
      const request = {
        type: "CREATE",
        entity: {
          id: 1,
          name: "groupo",
          entityType: "GROUP",
        },
      };

      const expected = `/${orgaName}/admin/groups/new`;

      expect(getUrlFromRequest(request, path, me)).toBe(expected);
    });
  });
});
