//@flow
import React, { Component } from "react";
import renderer from "react-test-renderer";
import connectData from "../connectData";
import { createRender, networkFromMock, flushPromises } from "../tests-utils";
import {
  mockNetworkSync,
  AnimalsQuery,
  AnimalQuery,
  AddAnimalMutation
} from "../tests-utils/mock-1";

test("restlay.commitMutation returns a promise of the expected result", () => {
  expect(this).toBe("implemented");
});

test("restlay.commitMutation correctly redraw with new data", () => {
  expect(this).toBe("implemented");
});
