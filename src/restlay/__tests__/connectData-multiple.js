//@flow
import React, { Component } from "react";
import renderer from "react-test-renderer";
import connectData from "../connectData";
import { createRender, networkFromMock, flushPromises } from "../tests-utils";
import { mockNetworkSync, AnimalsQuery, AnimalQuery } from "../tests-utils/mock-1";

test("it is possible to query multiple queries", () => {
  expect(this).toBe("implemented");
});

test("multiple queries does not create multiple re-rendering", () => {
  expect(this).toBe("implemented");
});
