//@flow
import React, { Component } from "react";
import renderer from "react-test-renderer";
import connectData from "../connectData";
import { createRender, networkFromMock, flushPromises } from "../tests-utils";
import { mockNetworkSync, AnimalQuery } from "../tests-utils/mock-1";

test("if a query defines cacheMaxAge, have recent cache, it should not fetch again but instantly draw", async () => {
  expect(this).toBe("implemented");
});

test("if a query have cacheMaxAge, but cache is too old, it should fetch again on a new mount", async () => {
  expect(this).toBe("implemented");
  // need one second cache or something :D
  // also inject a unique thing so it does not collide with other tests
});

test("forceFetch option always ignore the cache and trigger re-fetch", async () => {
  expect(this).toBe("implemented");
});
