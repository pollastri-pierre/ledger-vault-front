//@flow
import React, { Component } from "react";
import renderer from "react-test-renderer";
import connectData from "../connectData";
import { createRender, networkFromMock, flushPromises } from "../tests-utils";
import { mockNetworkSync, AnimalQuery } from "../tests-utils/mock-1";

test("if component terminates earlier it should not trigger errors if there are pending work", async () => {
  expect(this).toBe("implemented");
});
