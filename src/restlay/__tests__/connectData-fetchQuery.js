//@flow
import React, { Component } from "react";
import renderer from "react-test-renderer";
import connectData from "../connectData";
import { createRender, networkFromMock, flushPromises } from "../tests-utils";
import { mockNetworkSync, AnimalsQuery, AnimalQuery } from "../tests-utils/mock-1";

test("restlay.fetchQuery can be used to fetch arbitrary queries", () => {
  expect(this).toBe("implemented");
});

test("restlay.fetchQuery from A (no dep) triggers a refresh of B (if depends on fetched data)", () => {
  expect(this).toBe("implemented");
});
