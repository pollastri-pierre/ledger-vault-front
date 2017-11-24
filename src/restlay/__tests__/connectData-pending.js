//@flow
import React, { Component } from "react";
import renderer from "react-test-renderer";
import connectData from "../connectData";
import { createRender, networkFromMock, flushPromises } from "../tests-utils";
import { mockNetworkSync, AnimalQuery } from "../tests-utils/mock-1";

test("pending boolean gets injected by default during a transition", async () => {
  expect(this).toBe("implemented");
});
