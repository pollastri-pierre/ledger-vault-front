// @flow

import { deserializeHistory } from "utils/history";

import groupHistory from "utils/history/fixtures/groupHistory.json";
import userHistory from "utils/history/fixtures/userHistory.json";
import transactionHistory from "utils/history/fixtures/transactionHistory.json";

describe("deserializeHistory", () => {
  test("should deserialize group history", () => {
    const res = deserializeHistory(groupHistory);
    expect(res).toEqual([
      {
        type: "CREATE",
        requestID: 7,
        steps: [
          {
            type: "CREATED",
            createdBy: groupHistory[0][0].created_by,
            createdOn: groupHistory[0][0].created_on,
            approvalsSteps: [
              {
                quorum: 2,
                approvals: [
                  {
                    type: "APPROVE",
                    createdOn: groupHistory[0][0].approvals[0].created_on,
                    createdBy: groupHistory[0][0].approvals[0].created_by,
                  },
                  {
                    type: "APPROVE",
                    createdOn: groupHistory[0][0].approvals[1].created_on,
                    createdBy: groupHistory[0][0].approvals[1].created_by,
                  },
                ],
              },
            ],
          },
          {
            type: "APPROVED",
            createdOn: groupHistory[0][1].created_on,
            createdBy: groupHistory[0][1].created_by,
          },
        ],
      },
      {
        type: "EDIT",
        requestID: 8,
        steps: [
          {
            type: "EDITED",
            createdBy: groupHistory[1][0].created_by,
            createdOn: groupHistory[1][0].created_on,
            edit_data: {
              members: [12],
              name: "group",
            },
            approvalsSteps: [
              {
                quorum: 2,
                approvals: [
                  {
                    type: "ABORT",
                    createdOn: groupHistory[1][0].approvals[0].created_on,
                    createdBy: groupHistory[1][0].approvals[0].created_by,
                  },
                  {
                    type: "APPROVE",
                    createdOn: groupHistory[1][0].approvals[1].created_on,
                    createdBy: groupHistory[1][0].approvals[1].created_by,
                  },
                ],
              },
            ],
          },
          {
            type: "ABORTED",
            createdOn: groupHistory[1][1].created_on,
            createdBy: groupHistory[1][1].created_by,
          },
        ],
      },
      {
        type: "DELETE",
        requestID: 9,
        steps: [
          {
            type: "REVOKED",
            createdBy: groupHistory[2][0].created_by,
            createdOn: groupHistory[2][0].created_on,
            approvalsSteps: [
              {
                quorum: 2,
                approvals: [
                  {
                    type: "APPROVE",
                    createdOn: groupHistory[2][0].approvals[0].created_on,
                    createdBy: groupHistory[2][0].approvals[0].created_by,
                  },
                  {
                    type: "APPROVE",
                    createdOn: groupHistory[2][0].approvals[1].created_on,
                    createdBy: groupHistory[2][0].approvals[1].created_by,
                  },
                ],
              },
            ],
          },
          {
            type: "APPROVED",
            createdOn: groupHistory[2][1].created_on,
            createdBy: groupHistory[2][1].created_by,
          },
        ],
      },
    ]);
  });

  test("should deserialize transaction history", () => {
    const res = deserializeHistory(transactionHistory);
    expect(res).toEqual([
      {
        type: "CREATE",
        requestID: 6,
        steps: [
          {
            type: "CREATED",
            createdOn: transactionHistory[0][0].created_on,
            createdBy: transactionHistory[0][0].created_by,
            approvalsSteps: [
              {
                quorum: 1,
                approvals: [
                  {
                    type: "APPROVE",
                    createdBy: transactionHistory[0][0].approvals[0].created_by,
                    createdOn: transactionHistory[0][0].approvals[0].created_on,
                  },
                ],
              },
            ],
          },
          {
            type: "APPROVED",
            createdOn: transactionHistory[0][1].created_on,
            createdBy: transactionHistory[0][1].created_by,
          },
          {
            type: "SUBMITTED",
            createdOn: transactionHistory[0][2].created_on,
            createdBy: transactionHistory[0][2].created_by,
          },
        ],
      },
    ]);
  });

  test("should deserialize user history", () => {
    const res = deserializeHistory(userHistory);
    expect(res).toEqual([
      {
        type: "CREATE",
        requestID: 4,
        steps: [
          {
            type: "INVITED",
            createdBy: userHistory[0][0].created_by,
            createdOn: userHistory[0][0].created_on,
          },
          {
            type: "REGISTERED",
            createdOn: userHistory[0][1].created_on,
            createdBy: userHistory[0][1].created_by,
            approvalsSteps: [
              {
                quorum: 2,
                approvals: [
                  {
                    type: "APPROVE",
                    createdBy: userHistory[0][1].approvals[0].created_by,
                    createdOn: userHistory[0][1].approvals[0].created_on,
                  },
                  {
                    type: "APPROVE",
                    createdBy: userHistory[0][1].approvals[1].created_by,
                    createdOn: userHistory[0][1].approvals[1].created_on,
                  },
                ],
              },
            ],
          },
          {
            type: "APPROVED",
            createdOn: userHistory[0][2].created_on,
            createdBy: userHistory[0][2].created_by,
          },
        ],
      },
      {
        type: "DELETE",
        requestID: 11,
        steps: [
          {
            type: "REVOKED",
            createdOn: userHistory[1][0].created_on,
            createdBy: userHistory[1][0].created_by,
            approvalsSteps: [
              {
                quorum: 2,
                approvals: [
                  {
                    type: "APPROVE",
                    createdBy: userHistory[1][0].approvals[0].created_by,
                    createdOn: userHistory[1][0].approvals[0].created_on,
                  },
                  {
                    type: "APPROVE",
                    createdBy: userHistory[1][0].approvals[1].created_by,
                    createdOn: userHistory[1][0].approvals[1].created_on,
                  },
                ],
              },
            ],
          },
          {
            type: "APPROVED",
            createdOn: userHistory[1][1].created_on,
            createdBy: userHistory[1][1].created_by,
          },
        ],
      },
    ]);
  });
});
