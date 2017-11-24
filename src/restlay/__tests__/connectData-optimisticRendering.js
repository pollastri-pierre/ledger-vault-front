//@flow
import React, { Component } from "react";
import renderer from "react-test-renderer";
import connectData from "../connectData";
import { createRender, networkFromMock, flushPromises } from "../tests-utils";
import { mockNetworkSync, AnimalQuery } from "../tests-utils/mock-1";

test("optimisticRendering=true should initial render from cache if available", async () => {
  expect(this).toBe("implemented");
});
