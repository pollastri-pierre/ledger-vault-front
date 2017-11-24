//@flow
import React, { Component } from "react";
import renderer from "react-test-renderer";
import connectData from "../connectData";
import { createRender, networkFromMock, flushPromises } from "../tests-utils";
import {
  mockNetworkSync,
  AnimalsQuery,
  AnimalQuery
} from "../tests-utils/mock-1";

test("forceFetch force trigger a refresh with latest data", () => {
  expect(this).toBe("implemented");
});

test("forceFetch returns a Promise that ends after completion", () => {
  expect(this).toBe("implemented");
});

test("forceFetch will trigger a refresh of siblings that depend on same query", () => {
  expect(this).toBe("implemented");
});

test("forceFetch will reload multiple queries", () => {
  expect(this).toBe("implemented");
});

test("forceFetch reload queries even if it have a cacheMaxAge", () => {
  expect(this).toBe("implemented");
});
