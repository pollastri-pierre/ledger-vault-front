import { getModalClosePath } from "./modal";

describe("/utils/modal", () => {
  // Mock window location
  const { location } = window;

  beforeAll(() => {
    delete window.location;
    window.location = { pathname: "/ledger1" };
  });

  afterAll(() => {
    window.location = location;
  });

  describe("getModalClosePath", () => {
    it("account details", () => {
      testModalClosePath(
        { role: "admin" },
        "/ledger1/admin/accounts/details/15/overview",
        "/ledger1/admin/accounts",
      );
    });

    it("account edit modal", () => {
      testModalClosePath(
        { role: "admin" },
        "/ledger1/admin/accounts/edit/15",
        "/ledger1/admin/accounts",
      );
    });

    it("admin user view detail", () => {
      testModalClosePath(
        { role: "admin" },
        "/ledger1/admin/users/details/13/overview",
        "/ledger1/admin/users",
      );
    });

    it("admin acccount view receive", () => {
      testModalClosePath(
        { role: "admin" },
        "/ledger1/admin/accounts/view/15/receive/15",
        "/ledger1/admin/accounts/view/15",
      );
    });

    it("new account from dashboard", () => {
      testModalClosePath(
        { role: "admin" },
        "/ledger1/admin/dashboard/accounts/new",
        "/ledger1/admin/dashboard",
      );
    });

    it("user creation request from dashboard", () => {
      testModalClosePath(
        { role: "admin" },
        "/ledger1/admin/dashboard/users/details/13/overview",
        "/ledger1/admin/dashboard",
      );
    });

    it("new account from accounts page", () => {
      testModalClosePath(
        { role: "admin" },
        "/ledger1/admin/accounts/new",
        "/ledger1/admin/accounts",
      );
    });

    it("group details overview", () => {
      testModalClosePath(
        { role: "admin" },
        "/ledger1/admin/groups/details/2/overview",
        "/ledger1/admin/groups",
      );
    });

    it("users new", () => {
      testModalClosePath(
        { role: "admin" },
        "/ledger1/admin/users/new",
        "/ledger1/admin/users",
      );
    });

    it("admin task, nested match", () => {
      testModalClosePath(
        { role: "admin" },
        "/ledger1/admin/tasks/accounts/details/3/history?requestID=12",
        "/ledger1/admin/tasks",
      );
    });
  });
});

const testModalClosePath = (me, actual, expected) => {
  const res = getModalClosePath(actual, me);
  expect(res).toBe(expected);
};
